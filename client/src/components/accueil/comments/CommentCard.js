import React, { useState, useEffect } from 'react';
import Avatar from '../../Avatar';
import { Link } from 'react-router-dom';
import moment from 'moment';

import LikeButton from '../../LikeButton';
import { useSelector, useDispatch } from 'react-redux'
import CommentMenu from './CommentMenu';
import { likeComment, unLikeComment, updateComment } from '../../../redux/actions/commentAction';
import InputComment from '../InputComment';

const CommentCard = ({ children, comment, post, commentId }) => {

    const {auth, theme} = useSelector(state => state);
    const dispatch = useDispatch();

    const [content, setContent] = useState("");
    const [readMore, setReadMore] = useState(false)

    const [onEdit, setOnEdit] = useState(false)
    const [isLike, setIsLike] = useState(false)
    const [loadLike, setLoadLike] = useState(false)

    const [onReply, setOnReply] = useState(false);

    useEffect(() => {
        setContent(comment.content)
        setIsLike(false)
        setOnReply(false)
        if(comment.likes.find(like => like._id === auth.user._id)){
            setIsLike(true)
        }
    }, [comment, auth.user._id]);

    const handleLike = async () => {
        if(loadLike) return;
        setIsLike(true)

        setLoadLike(true)
        await dispatch(likeComment({comment, post, auth}))
        setLoadLike(false)
    }

    const handleUnLike = async () => {
        if(loadLike) return;
        setIsLike(false)

        setLoadLike(true)
        await dispatch(unLikeComment({comment, post, auth}))
        setLoadLike(false)
    }


    const handleUpdate = () => {
        if(comment.content !== content) {
            dispatch(updateComment({ comment, post, content, auth }))
            setOnEdit(false);
        } else {
            setOnEdit(false);
        }
    }

    const handleReply = () => {
        if(onReply) return setOnReply(false);
        setOnReply({ ...comment, commentId })
    }

    const styleCard = {
        opacity: comment._id ? 1 : 0.5,
        pointerEvents: comment._id ? 'inherit' : 'none'
    }

  return (
    <div className='comment_card mt-2' style={styleCard}>
        <Link to={`/profil/${comment.user._id}`} className="d-flex text-dark">
            <Avatar src={comment.user.avatar} size='small-avatar' />
            <h6 className='mx-1'>{comment.user.username}</h6>
        </Link>

        <div className="comment_content">
            <div className="flex-fill"
            style={{ filter: theme ? 'invert(1)' : 'invert(0)', color: theme ? 'white' : '#111' }}
            >
                {
                    onEdit ?
                    <textarea rows="4" value={content} className='rounded-xl p-2'
                        onChange={e => setContent(e.target.value)} />
                    : 
                    (<div> 
                        {
                            comment.tag && comment.tag._id !== comment.user._id &&
                            <Link to={`/profil/${comment.tag._id}`} className='mr-1'>
                                @{comment.tag.username}
                            </Link>
                        }
                        <span> { content.length < 100 ? content : readMore ? content + ' ' : content.slice(0, 100) + '...' }</span>
                        { content.length > 100 && (<span className='readMore' onClick={() => setReadMore(!readMore)}>
                        {readMore ? 'Cacher' : 'Voir plus'} </span>)}
                    </div>)
                }

                <div style={{ cursor: 'pointer' }}>
                    <small className='text-muted mr-3'>
                        {moment(comment.createdAt).fromNow()}
                    </small>

                    <small className='font-bold px-2'>
                        {comment.likes.length} Likes
                    </small>

                    {
                        onEdit 
                        ? <>
                            <small className="font-bold mr-3" onClick={handleUpdate}>
                                Valider
                            </small>
                            <small className='font-bold mr-3' onClick={() => setOnEdit(false)}>Annuler</small>
                        </>
                        : (<small className='font-bold mr-3' onClick={handleReply}>
                            {onReply ? 'Annuler' :'Répondre'}
                        </small>)
                    }
                    

                </div>
                
            </div>

            <div className='d-flex align-items-center cursor-pointer'>
                <CommentMenu post={post} comment={comment} setOnEdit={setOnEdit} />
                <LikeButton isLike={isLike} handleLike={handleLike} handleUnLike={handleUnLike}  />
            </div>
        </div>

        {
            onReply && 
            <InputComment post={post} onReply={onReply} setOnReply={setOnReply}>
                <Link to={`/profil/${onReply.user._id}`} className='mr-1 font-weight-bold'>
                    @{onReply.user.username}:
                </Link>
            </InputComment> 
        }
        {children}
    </div>
  )
}

export default CommentCard; 