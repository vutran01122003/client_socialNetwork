import replaceOldElem from '../../utils/replaceOldElem';
import { GLOBALTYPES } from '../actions/globalTypes';

const initialState = {
    loading: false,
    result: 0,
    posts: {},
    page: 0,
    maxPage: false
};

function postReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.POST.CREATE_POST: {
            const post = action.payload.post;
            const newPosts = { [post._id]: { ...post, comments: {} }, ...state.posts };

            return {
                ...state,
                posts: newPosts,
                result: state.result + 1
            };
        }

        case GLOBALTYPES.POST.LOADING_POST:
            return { ...state, ...action.payload };

        case GLOBALTYPES.POST.GET_POSTS: {
            const postList = action.payload.posts;
            const posts = postList.reduce((obj, post) => {
                return {
                    ...obj,
                    [post._id]: {
                        ...post,
                        isMaxComment: post.numberOfComment === 0 ? true : false,
                        comments: {}
                    }
                };
            }, {});

            return {
                ...state,
                posts: { ...state.posts, ...posts },
                result: Object.keys(state.posts).length + postList.length,
                page: action.payload.page,
                maxPage: action.payload.maxPage
            };
        }

        // case GLOBALTYPES.POST.GET_NEW_POSTS: {
        //     const posts = action.payload.posts.reducer((obj, post) => {
        //         obj[post._id] = post;
        //         return obj;
        //     }, {});

        //     console.log(posts);
        //     return {
        //         ...state,
        //         posts: {
        //             ...state.posts,
        //             ...posts
        //         }
        //     };
        // }

        case GLOBALTYPES.POST.LIKE_POST: {
            const postId = action.payload.postId;
            const posts = { ...state.posts };
            posts[postId].likes.push(action.payload.userData);

            return {
                ...state,
                posts: posts
            };
        }

        case GLOBALTYPES.POST.UNLIKE_POST: {
            const { postId, userId } = action.payload;
            const likes = state.posts[postId].likes;

            return {
                ...state,
                posts: {
                    ...state.posts,
                    [postId]: {
                        ...state.posts[postId],
                        likes: likes.filter((user) => user._id !== userId)
                    }
                }
            };
        }

        case GLOBALTYPES.POST.SAVE_POST: {
            const { userId, postId } = action.payload;
            const posts = { ...state.posts };
            posts[postId].saved.push(userId);

            return {
                ...state,
                posts: posts
            };
        }

        case GLOBALTYPES.POST.UNSAVE_POST: {
            const { userId, postId } = action.payload;

            const post = {
                ...state.posts[postId],
                saved: state.posts[postId].saved.filter((id) => userId !== id)
            };

            return {
                ...state,
                posts: {
                    ...state.posts,
                    [postId]: post
                }
            };
        }

        case GLOBALTYPES.POST.UPDATE_POST: {
            const newUpdatedPosts = replaceOldElem(state.posts, action.payload);
            return {
                ...state,
                posts: [...newUpdatedPosts]
            };
        }

        case GLOBALTYPES.POST.DELETE_POST: {
            const posts = { ...state.posts };
            delete posts[action.payload.postId];

            return {
                ...state,
                posts: posts,
                result: state.result - 1
            };
        }

        case GLOBALTYPES.COMMENT.GET_COMMENTS: {
            const { postId, comments } = action.payload;
            const posts = { ...state.posts };

            if (comments.length === 0) {
                posts[postId].isMaxComment = true;
            } else {
                posts[postId].comments = comments.reduce(
                    (obj, comment) => {
                        return {
                            ...obj,
                            [comment._id]: {
                                ...comment,
                                replies: {},
                                isMaxReply: comment?.numberOfChildComment > 0 ? false : true
                            }
                        };
                    },
                    { ...posts[postId].comments }
                );
            }

            return {
                ...state,
                posts
            };
        }

        case GLOBALTYPES.COMMENT.ADD_COMMENT: {
            const { postId, newComment } = action.payload;
            const posts = { ...state.posts };

            posts[postId].comments[newComment._id] = {
                ...newComment,
                replies: {},
                isMaxReply: true
            };
            posts[postId].numberOfComment++;

            return {
                ...state,
                posts
            };
        }

        case GLOBALTYPES.COMMENT.LIKE_COMMENT: {
            const { userData, commentId, postId } = action.payload;
            const posts = { ...state.posts };

            posts[postId].comments[commentId].likes.push(userData);

            return {
                ...state,
                posts
            };
        }

        case GLOBALTYPES.COMMENT.UNLIKE_COMMENT: {
            const { userId, commentId, postId } = action.payload;
            const posts = { ...state.posts };
            const currentComment = posts[postId].comments[commentId];

            currentComment.likes = currentComment.likes.filter((user) => user._id !== userId);

            return {
                ...state,
                posts
            };
        }

        case GLOBALTYPES.COMMENT.UPDATE_COMMENT: {
            const { postId, commentId, parentCommentId, comment } = action.payload;
            const posts = { ...state.posts };

            if (parentCommentId) {
                posts[postId].comments[parentCommentId].replies[commentId] = comment;
            } else {
                posts[postId].comments[commentId] = {
                    ...comment,
                    replies: posts[postId].comments[commentId].replies
                };
            }

            return {
                ...state,
                posts
            };
        }

        case GLOBALTYPES.COMMENT.DELETE_COMMENT: {
            const { postId, commentId, parentCommentId } = action.payload;
            const posts = { ...state.posts };

            if (parentCommentId) {
                delete posts[postId].comments[parentCommentId].replies[commentId];
                posts[postId].comments[parentCommentId].numberOfChildComment--;
            } else {
                posts[postId].numberOfComment -= posts[postId].comments[commentId]?.numberOfChildComment;
                delete posts[postId].comments[commentId];
            }

            posts[postId].numberOfComment--;

            return {
                ...state,
                posts
            };
        }

        case GLOBALTYPES.COMMENT.GET_REPLIES: {
            const { postId, commentId, replyData } = action.payload;
            const posts = { ...state.posts };
            let replies = posts[postId].comments[commentId].replies;

            if (replyData.length === 0) {
                posts[postId].comments[commentId].isMaxReply = true;
                return state;
            }

            posts[postId].comments[commentId].replies = replyData.reduce((obj, reply) => {
                return { ...obj, [reply._id]: reply };
            }, replies);

            return {
                ...state,
                posts: posts
            };
        }
        case GLOBALTYPES.COMMENT.ADD_REPLY_COMMENT: {
            const { postId, newComment, parentCommentId } = action.payload;
            const posts = { ...state.posts };

            posts[postId].comments[parentCommentId].replies[newComment._id] = newComment;
            posts[postId].comments[parentCommentId].numberOfChildComment++;
            posts[postId].numberOfComment++;
            return {
                ...state,
                posts: posts
            };
        }

        default:
            return state;
    }
}

export default postReducer;
