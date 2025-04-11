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
  const auth = getAuth();

  const fetchUserData = async () => {
    try {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", data?.uploadedBy?.email));
        if (userDoc.exists()) {
          setuploadedBy(userDoc.data());
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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

  useEffect(() => {
    if (data?.likedBy?.includes(auth.currentUser?.email)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [data?.likedBy, auth.currentUser?.email]);

  useEffect(() => {
    const postRef = doc(db, "posts", data?.id);
    const unsubscribe = onSnapshot(postRef, (doc) => {
      if (doc.exists()) {
        setComments(doc.data().comments || []);
      }
    });
    return () => unsubscribe();
  }, [data?.id]);

  const likePost = async () => {
    const postRef = doc(db, "posts", data?.id);
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);

    await updateDoc(postRef, {
      likedBy: newIsLiked
        ? arrayUnion(auth.currentUser?.email)
        : arrayRemove(auth.currentUser?.email),
    });
  };

  const addComment = async () => {
    if (!comment.trim()) return;

    const postRef = doc(db, "posts", data?.id);
    await updateDoc(postRef, {
      comments: arrayUnion({
        id: Date.now().toString(),
        comment: comment.trim(),
        doneBy: auth.currentUser?.email,
        userPhoto: currentUser?.photo,
        userName: currentUser?.name,
        timestamp: new Date().toISOString(),
      }),
    });
    setcomment("");
  };

  const deleteComment = async (commentId) => {
    const postRef = doc(db, "posts", data?.id);
    const updatedComments = comments.filter((c) => c.id !== commentId);
    await updateDoc(postRef, { comments: updatedComments });
  };

  const deletePost = async () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "posts", data?.id));
            onRefresh?.(data?.id);
          } catch (error) {
            console.error("Error deleting post:", error);
            Alert.alert("Error", "Failed to delete the post");
          }
        },
      },
    ]);
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Image
            source={{ uri: item.userPhoto }}
            style={styles.commentUserPhoto}
          />
          <Text style={styles.commentUserName}>{item.userName}</Text>
        </View>
        <Text style={styles.commentText}>{item.comment}</Text>
      </View>
      {item.doneBy === auth.currentUser?.email && (
        <TouchableOpacity
          onPress={() => deleteComment(item.id)}
          style={styles.deleteButton}
        >
          <Icon name="trash" size={18} color="#FF4444" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.divider} />

      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image style={styles.userPhoto} source={{ uri: uploadedBy?.photo }} />
          <Text style={styles.userName}>{uploadedBy?.name}</Text>
        </View>

        {auth.currentUser?.email === data?.uploadedBy?.email && (
          <TouchableOpacity
            onPress={deletePost}
            style={styles.deletePostButton}
          >
            <Icon name="trash" size={20} color="#FF4444" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.postContent}>{data?.content}</Text>

      {data?.media && (
        <View style={styles.mediaContainer}>
          {isLoading && (
            <ActivityIndicator
              size="large"
              color="#0066FF"
              style={styles.loader}
            />
          )}
          <Image
            style={styles.postImage}
            source={{ uri: data?.media }}
            onLoad={() => setIsLoading(false)}
          />
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={likePost} style={styles.actionButton}>
          <Icon
            name={isLiked ? "thumbs-up" : "thumbs-o-up"}
            size={25}
            color={isLiked ? "#0066FF" : "#666"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setisCommenting(!isCommenting)}
          style={styles.actionButton}
        >
          <Icon name="comments-o" size={25} color="#666" />
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.actionButton}>
          <Icon name="share" size={25} color="#666" />
        </TouchableOpacity> */}
      </View>

      {isCommenting && (
        <View style={styles.commentsSection}>
          <View style={styles.addCommentContainer}>
            <CustomInput
              label="Add a Comment"
              placeholder="Write something..."
              value={comment}
              onChangeText={setcomment}
              mt={20}
            />
            <TouchableOpacity
              onPress={addComment}
              style={[
                styles.postCommentButton,
                !comment.trim() && styles.disabledButton,
              ]}
              disabled={!comment.trim()}
            >
              <Text style={styles.postCommentText}>Post</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.commentsListContainer}>
            <Text style={styles.commentsHeader}>Comments</Text>
            <FlatList
              data={comments}
              renderItem={renderComment}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
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
  container: {
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 15,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userPhoto: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  userName: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  deletePostButton: {
    padding: 8,
  },
  postContent: {
    paddingHorizontal: 15,
    paddingTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
  mediaContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  loader: {
    position: "absolute",
    zIndex: 1,
  },
  postImage: {
    width: "95%",
    height: 200,
    borderRadius: 12,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    width: "70%",
    alignSelf: "center",
  },
  actionButton: {
    padding: 8,
  },
  commentsSection: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  addCommentContainer: {
    marginBottom: 20,
  },
  postCommentButton: {
    alignSelf: "flex-end",
    marginTop: 10,
    backgroundColor: "#0066FF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  postCommentText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  commentsListContainer: {
    marginBottom: 20,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  commentUserPhoto: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentUserName: {
    fontWeight: "600",
    color: "#333",
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#444",
  },
  deleteButton: {
    padding: 8,
  },
  closeCommentsButton: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  closeCommentsText: {
    color: "#0066FF",
    fontWeight: "600",
  },
});
