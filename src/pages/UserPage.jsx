import React, {useCallback, useEffect, useState} from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import StarRating from '../components/utils/StarRating'
import InputRating from '../components/utils/InputRating'
import ReviewBlock from '../components/ReviewBlock'
import {VscChromeClose} from 'react-icons/vsc'
import useGetUserInfo from '../hooks/getUserInfo'
import {useParams} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {getImageURL} from '../helpers/image'
import Moment from 'react-moment'
import useGetReview from '../hooks/getReview'
import Skeleton from 'react-loading-skeleton'
import {useForm} from 'react-hook-form'
import {getSellerLots} from '../services/lots'
import {createReview} from '../services/reviews'
import {dispatchAlert} from '../helpers/alert'
import ValidateWrapper from '../components/UI/ValidateWrapper'

const UserPage = () => {
    const theme = useSelector((state) => state?.theme?.mode)
    const {id} = useParams()
    const [showReview, setShowReview] = useState(false)
    const currentUser = useSelector((state) => state?.auth?.user)
    const [filterParam, setFilterParam] = useState('init')
    const [refatch, setRefatch] = useState(true)
    const {user} = useGetUserInfo(id)
    const {reviews} = useGetReview(id, refatch)
    const {
        register,
        formState: {errors},
        handleSubmit,
        reset,
    } = useForm({mode: 'onSubmit', reValidateMode: 'onChange'})
    const [sellerLots, setSellerLots] = useState({
        isLoaded: false,
        items: [],
    })
    const [rating, setRating] = useState(null)
    useEffect(() => {
        getSellerLots(id)
            .then((res) => {
                setSellerLots({isLoaded: true, items: res?.data})
            })
            .catch(() => {})
    }, [id])

    useEffect(() => {
        if (refatch) {
            setRefatch(false)
        }
    }, [refatch])

    const seterRating = useCallback((value) => {
        setRating(value)
    }, [])

    const filtredReviews = () => {
        if (filterParam === 'init') {
            return reviews.items
        } else {
            return reviews.items?.filter((i) => i.rating === +filterParam)
        }
    }

    const onSubmitCreateReview = (data) => {
        const req = {...data, rating}
        createReview(req)
            .then(() => {
                setRefatch(true)
                setShowReview(false)
                dispatchAlert('success', 'Отзыв успешно отправлен')
                reset()
            })
            .catch(() => dispatchAlert('danger', 'Произошла ошибка'))
    }

    return (
        <>
            <main>
                <Container>
                    <section className="user-page pt-5 mb-6">
                        <Row className="gy-4 gy-sm-5 gx-4 gx-xxl-5">
                            <Col sm={5} md={4} lg={3}>
                                {user.isLoaded ? (
                                    <img src={getImageURL(user.item?.avatar)} alt="" className="img" />
                                ) : (
                                    <Skeleton
                                        count={1}
                                        baseColor={theme === 'dark' ? `#322054` : '#f05d66'}
                                        highlightColor={theme === 'dark' ? `#5736db` : '#eb3349'}
                                        width={'100%'}
                                        height={'280px'}
                                        borderRadius={'1.5em'}
                                    />
                                )}
                            </Col>
                            <Col sm={7} md={8} lg={4} xl={3}>
                                {user.isLoaded ? (
                                    <h4>{user.item?.fullName}</h4>
                                ) : (
                                    <Skeleton
                                        count={1}
                                        baseColor={theme === 'dark' ? `#322054` : '#f05d66'}
                                        highlightColor={theme === 'dark' ? `#5736db` : '#eb3349'}
                                        width={'100%'}
                                        height={'25px'}
                                    />
                                )}
                                {user.isLoaded ? (
                                    <StarRating rate={user.item?.rating || 0} className="justify-content-start" />
                                ) : (
                                    <Skeleton
                                        count={1}
                                        baseColor={theme === 'dark' ? `#322054` : '#f05d66'}
                                        highlightColor={theme === 'dark' ? `#5736db` : '#eb3349'}
                                        width={'100%'}
                                        height={'25px'}
                                    />
                                )}
                                {user.isLoaded ? (
                                    <p className="mt-4">
                                        На сайте с <Moment format={'LL'} date={user.item?.createdAt} />
                                    </p>
                                ) : (
                                    <Skeleton
                                        count={1}
                                        baseColor={theme === 'dark' ? `#322054` : '#f05d66'}
                                        highlightColor={theme === 'dark' ? `#5736db` : '#eb3349'}
                                        width={'100%'}
                                        height={'25px'}
                                    />
                                )}
                                {user.isLoaded ? (
                                    <p className="mt-2">
                                        Завершено сделок: <strong>{user.item?.salesCount}</strong>
                                    </p>
                                ) : (
                                    <Skeleton
                                        count={1}
                                        baseColor={theme === 'dark' ? `#322054` : '#f05d66'}
                                        highlightColor={theme === 'dark' ? `#5736db` : '#eb3349'}
                                        width={'100%'}
                                        height={'25px'}
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowReview(true)}
                                    className="btn-6 mt-4"
                                    disabled={currentUser?.id === +id}
                                >
                                    Оставить отзыв
                                </button>
                            </Col>
                            <Col xs={12} lg={5} xl={6}>
                                <Row className="info g-2 g-sm-4">
                                    <Col xs={5}>Имя:</Col>
                                    <Col xs={7}>
                                        {user.isLoaded ? (
                                            user.item?.firstName
                                        ) : (
                                            <Skeleton
                                                count={1}
                                                baseColor={theme === 'dark' ? `#322054` : '#f05d66'}
                                                highlightColor={theme === 'dark' ? `#5736db` : '#eb3349'}
                                                width={'100%'}
                                                height={'25px'}
                                            />
                                        )}
                                    </Col>
                                    <Col xs={5}>Фамилия:</Col>
                                    <Col xs={7}>
                                        {user.isLoaded ? (
                                            user.item?.lastName
                                        ) : (
                                            <Skeleton
                                                count={1}
                                                baseColor={theme === 'dark' ? `#322054` : '#f05d66'}
                                                highlightColor={theme === 'dark' ? `#5736db` : '#eb3349'}
                                                width={'100%'}
                                                height={'25px'}
                                            />
                                        )}
                                    </Col>
                                    <Col xs={5}>Ник:</Col>
                                    <Col xs={7}>
                                        {user.isLoaded ? (
                                            `@${user.item?.nickname}`
                                        ) : (
                                            <Skeleton
                                                count={1}
                                                baseColor={theme === 'dark' ? `#322054` : '#f05d66'}
                                                highlightColor={theme === 'dark' ? `#5736db` : '#eb3349'}
                                                width={'100%'}
                                                height={'25px'}
                                            />
                                        )}
                                    </Col>
                                    <Col xs={5}>Пол:</Col>
                                    <Col xs={7}>
                                        {user.isLoaded ? (
                                            `${user.item?.sex ? 'Женский' : 'Мужской'}`
                                        ) : (
                                            <Skeleton
                                                count={1}
                                                baseColor={theme === 'dark' ? `#322054` : '#f05d66'}
                                                highlightColor={theme === 'dark' ? `#5736db` : '#eb3349'}
                                                width={'100%'}
                                                height={'25px'}
                                            />
                                        )}
                                    </Col>
                                    <Col xs={5}>Дата рождения:</Col>
                                    <Col xs={7}>
                                        {user.isLoaded ? (
                                            user.item?.birthdayForUser
                                        ) : (
                                            <Skeleton
                                                count={1}
                                                baseColor={theme === 'dark' ? `#322054` : '#f05d66'}
                                                highlightColor={theme === 'dark' ? `#5736db` : '#eb3349'}
                                                width={'100%'}
                                                height={'25px'}
                                            />
                                        )}
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12} lg={7}>
                                <div className="d-flex align-items-center mb-4">
                                    <span>Показать:</span>
                                    <select className="w-50 ms-4" onChange={(e) => setFilterParam(e.target.value)}>
                                        <option value="init">Все отзывы</option>
                                        <option value="5">5 звезд</option>
                                        <option value="4">4 звезды</option>
                                        <option value="3">3 звезды</option>
                                        <option value="2">2 звезды</option>
                                        <option value="1">1 звезда</option>
                                    </select>
                                </div>
                                {reviews.isLoaded ? (
                                    filtredReviews().length > 0 ? (
                                        filtredReviews().map((i) => (
                                            <ReviewBlock
                                                key={i.id}
                                                fullName={i.user?.fullName}
                                                avatar={i.user?.avatar}
                                                rating={i.rating}
                                                description={i.text}
                                                nickname={i.user?.nickname}
                                            />
                                        ))
                                    ) : (
                                        <h6>Отзывов нет</h6>
                                    )
                                ) : (
                                    <Skeleton
                                        count={1}
                                        baseColor={theme === 'dark' ? `#322054` : '#f05d66'}
                                        highlightColor={theme === 'dark' ? `#5736db` : '#eb3349'}
                                        width={'100%'}
                                        height={'200px'}
                                    />
                                )}
                            </Col>
                        </Row>
                    </section>
                </Container>
            </main>

            <Modal show={showReview} onHide={() => setShowReview(false)}>
                <Modal.Body>
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <h3 className="color-1">Оставьте отзыв</h3>
                        <button type="button" onClick={() => setShowReview(false)} className="btn-4 px-3 py-2">
                            <VscChromeClose />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmitCreateReview)}>
                        <div className="mb-2">Приобретенный лот:</div>

                        <select {...register('lotId', {required: 'Выберите значение'})}>
                            {sellerLots.items?.length > 0 ? (
                                sellerLots.items?.map((i) => (
                                    <option key={i.id} value={i.lotId}>
                                        {i.id}
                                    </option>
                                ))
                            ) : (
                                <span>Нет лотов</span>
                            )}
                        </select>

                        <div className="mt-4 mb-2">Ваша оценка:</div>
                        <InputRating className="fs-15" seterRating={seterRating} />
                        <div className="mt-4 mb-2">Текст отзыва:</div>
                        <ValidateWrapper error={errors?.text}>
                            <textarea
                                rows={5}
                                placeholder="Отзыв"
                                {...register('text', {required: 'Заполните поле'})}
                            />
                        </ValidateWrapper>
                        <button type="submit" className="btn-5 w-100 mt-4">
                            Отправить
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default UserPage
