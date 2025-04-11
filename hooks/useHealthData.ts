// import { StyleSheet, Text, View } from "react-native";
// import React, { useEffect, useState } from "react";
// import AppleHealthKit, {
//   HealthInputOptions,
//   HealthKitPermissions,
//   HealthUnit,
// } from "react-native-health";

// const useHealthData = () => {
//   const { Permissions } = AppleHealthKit.Constants;

//   const permissions: HealthKitPermissions = {
//     permissions: {
//       read: [
//         Permissions.Steps,
//         Permissions.FlightsClimbed,
//         Permissions.DistanceWalkingRunning,
//       ],
//       write: [],
//     },
//   };

//   const [hasPermissions, setHasPermission] = useState(false);

//   useEffect(() => {
//     AppleHealthKit.initHealthKit(permissions, (err) => {
//       if (err) {
//         console.log("Error getting permissions");
//         return;
//       }
//       setHasPermission(true);
//     });
//   }, []);

//   const [steps, setSteps] = useState(0);
//   const [flights, setFlights] = useState(0);
//   const [distance, setDistance] = useState(0);

//   // HealthKit implementation

//   return { steps, flights, distance };
// };

// export default useHealthData;
