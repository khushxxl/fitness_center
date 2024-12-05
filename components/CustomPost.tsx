import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { customAppStyles } from "../utils/styles";
import { AppContext } from "../context/AppContext";
import {
  arrayUnion,
  arrayRemove,
  doc,
  updateDoc,
  onSnapshot,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import CustomInput from "./CustomInput";
import { getAuth } from "firebase/auth";

const CustomPost = ({ data, onRefresh }) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { appUser } = useContext(AppContext);
  const [isCommenting, setisCommenting] = useState(false);
  const [comment, setcomment] = useState("");
  const [comments, setComments] = useState(data?.comments || []);
  const [currentUser, setCurrentUser] = useState(null);

  const [uploadedBy, setuploadedBy] = useState<any>();

  const fetchUserData = async () => {
    try {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", data?.uploadedBy?.email));
        if (userDoc.exists()) {
          const data: any = userDoc.data();
          setuploadedBy(data);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const auth = getAuth();

  useEffect(() => {
    fetchUserData();
    const fetchUser = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.email);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setCurrentUser(userDocSnap.data());
        }
      }
    };
    fetchUser();
  }, [auth.currentUser]);

  const isLikedChecker = () => {
    if (data?.likedBy?.includes(auth.currentUser?.email)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  };

  const likePost = async () => {
    const postRef = doc(db, "posts", data?.id);

    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);

    await updateDoc(postRef, {
      likedBy: newIsLiked
        ? arrayUnion(auth.currentUser?.email)
        : arrayRemove(auth.currentUser?.email),
    }).then(() => {
      console.log(newIsLiked ? "Post liked" : "Post unliked");
    });
  };

  const addComment = async () => {
    const postRef = doc(db, "posts", data?.id);
    await updateDoc(postRef, {
      comments: arrayUnion({
        id: Date.now().toString(),
        comment: comment,
        doneBy: auth.currentUser?.email,
        userPhoto: currentUser?.photo,
        userName: currentUser?.name,
        timestamp: new Date().toISOString(),
      }),
    }).then(() => {
      setcomment("");
      console.log("comment added");
    });
  };

  const deleteComment = async (commentId) => {
    const postRef = doc(db, "posts", data?.id);
    const updatedComments = comments.filter((c) => c.id !== commentId);
    await updateDoc(postRef, {
      comments: updatedComments,
    }).then(() => {
      console.log("comment deleted");
    });
  };

  const deletePost = async () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "posts", data?.id));
            console.log("Post deleted successfully");
            if (onRefresh) {
              onRefresh(data?.id);
            }
          } catch (error) {
            console.error("Error deleting post:", error);
            Alert.alert("Error", "Failed to delete the post");
          }
        },
        style: "destructive",
      },
    ]);
  };

  useEffect(() => {
    isLikedChecker();
  }, [data?.likedBy, auth.currentUser?.email]);

  useEffect(() => {
    const postRef = doc(db, "posts", data?.id);
    const unsubscribe = onSnapshot(postRef, (doc) => {
      if (doc.exists()) {
        setComments(doc.data().comments || []);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [data?.id]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const renderComment = ({ item }) => {
    console.log();
    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentContent}>
          <Text>{item.comment}</Text>
        </View>
        {item.doneBy === auth.currentUser?.email && (
          <TouchableOpacity
            onPress={() => deleteComment(item.id)}
            style={styles.deleteButton}
          >
            <Icon name="trash" size={20} color="red" />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  return (
    <View>
      <View style={customAppStyles.horizontalLine} />

      <View style={{ marginTop: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 10,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{ height: 50, width: 50, borderRadius: 25 }}
              source={{ uri: uploadedBy?.photo }}
            />
            <Text style={{ marginLeft: 10, fontWeight: "bold" }}>
              {uploadedBy?.name}
            </Text>
          </View>
          {auth.currentUser?.email === data?.uploadedBy?.email && (
            <TouchableOpacity onPress={deletePost} style={{ marginRight: 10 }}>
              <Icon name="trash" size={20} color="red" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={{ marginHorizontal: 10, marginTop: 10 }}>
          {data?.content}
        </Text>
      </View>

      {data && data?.media && (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          {isLoading && (
            <ActivityIndicator
              size="small"
              color="#0000ff"
              style={{ position: "absolute" }}
            />
          )}
          <Image
            style={{
              borderRadius: 10,
              opacity: 0.9,
              position: "relative",
              marginHorizontal: 20,
              width: "95%",
              height: 140,
              alignSelf: "center",
            }}
            source={{ uri: data?.media }}
            onLoad={handleImageLoad}
            onLoadEnd={() => setIsLoading(false)}
          />
        </View>
      )}

      <View style={[customAppStyles.horizontalLine, { marginTop: 20 }]} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "70%",
          alignSelf: "center",
          marginTop: 10,
        }}
      >
        <TouchableOpacity onPress={likePost}>
          <Icon
            color={isLiked ? "blue" : "gray"}
            name={isLiked ? "thumbs-up" : "thumbs-o-up"}
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setisCommenting(!isCommenting)}>
          <Icon color={"gray"} name="comments-o" size={25} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon color={"gray"} name="share" size={25} />
        </TouchableOpacity>
      </View>
      {isCommenting && (
        <View style={styles.commentsSection}>
          <View style={styles.addCommentContainer}>
            <CustomInput
              mt={20}
              label={"Add a Comment"}
              placeholder={"Enter comment"}
              value={comment}
              onChangeText={setcomment}
            />
            <TouchableOpacity
              onPress={addComment}
              style={styles.postCommentButton}
            >
              <Text style={styles.postCommentText}>Post</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.commentsListContainer}>
            <Text style={styles.commentsHeader}>All Comments</Text>
            <FlatList
              data={comments}
              renderItem={renderComment}
              keyExtractor={(item) => item.id}
            />
          </View>

          <TouchableOpacity
            style={styles.closeCommentsButton}
            onPress={() => setisCommenting(false)}
          >
            <Text style={styles.closeCommentsText}>Close Comments</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CustomPost;

const styles = StyleSheet.create({
  commentsSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  addCommentContainer: {
    marginBottom: 20,
  },
  postCommentButton: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
  postCommentText: {
    color: "blue",
    fontSize: 14,
    fontWeight: "bold",
  },
  commentsListContainer: {
    marginBottom: 20,
  },
  commentsHeader: {
    fontWeight: "500",
    marginBottom: 10,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  commentUserPhoto: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentUserName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  deleteButton: {
    padding: 5,
  },
  closeCommentsButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeCommentsText: {
    color: "blue",
    fontWeight: "bold",
  },
});
