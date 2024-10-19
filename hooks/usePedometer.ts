import { useState, useEffect, useContext, useCallback } from "react";
import { Pedometer } from "expo-sensors";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { AppContext } from "../context/AppContext";
import * as Location from "expo-location"; // Updated for permissions

const usePedometer = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [stepCount, setStepCount] = useState(0);
  const { appUser } = useContext(AppContext);
  let subscription = null; // Prevent re-initialization

  // Fetch initial step count from Firebase
  const fetchStepCountFromFirebase = useCallback(async () => {
    if (!appUser?.email) return;

    try {
      const docRef = doc(db, "users", appUser.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setStepCount(data.stepCount || 0);
      } else {
        await setDoc(docRef, { stepCount: 0 });
      }
    } catch (error) {
      console.error("Error fetching steps from Firebase:", error);
    }
  }, [appUser?.email]);

  // Update step count in Firebase
  const updateStepCountInFirebase = useCallback(
    async (newStepCount) => {
      if (!appUser?.email) return;

      try {
        const docRef = doc(db, "users", appUser.email);
        await setDoc(docRef, { stepCount: newStepCount }, { merge: true });
      } catch (error) {
        console.error("Error updating steps in Firebase:", error);
      }
    },
    [appUser?.email]
  );

  // Handle Pedometer subscription and permissions
  const subscribeToPedometer = useCallback(async () => {
    try {
      const { status } = await Location.requestPermissionsAsync(); // Request motion permission

      if (status !== "granted") {
        setIsPedometerAvailable("false");
        alert("Permission to access motion is required.");
        return;
      }

      const available = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(available));
      if (!available) return;

      await fetchStepCountFromFirebase();

      // Get initial step count for the current day
      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const { steps: initialSteps = 0 } = await Pedometer.getStepCountAsync(
        start,
        end
      );

      setStepCount((prev) => {
        const newCount = prev + initialSteps;
        updateStepCountInFirebase(newCount);
        return newCount;
      });

      // Watch for real-time step changes
      subscription = Pedometer.watchStepCount(({ steps }) => {
        setStepCount((prev) => {
          const newCount = prev + steps;
          updateStepCountInFirebase(newCount);
          return newCount;
        });
      });
    } catch (error) {
      console.error("Pedometer error:", error);
      setIsPedometerAvailable("false");
    }
  }, [fetchStepCountFromFirebase, updateStepCountInFirebase]);

  // Subscribe to the pedometer when component mounts
  useEffect(() => {
    if (appUser?.email) subscribeToPedometer();

    return () => {
      if (subscription) subscription.remove(); // Clean up subscription
    };
  }, [appUser?.email, subscribeToPedometer]);

  return { isPedometerAvailable, stepCount };
};

export default usePedometer;
