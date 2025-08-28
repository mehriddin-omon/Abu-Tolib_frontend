import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import image from '@/assets/img/image.png'
import style from './home.module.css';
import { data } from '@/page/guest/data';

export const Home = () => {
    return (
        <>
            <div id='home' className='flex flex-col justify-between sm:flex-row' >
                <div className='pt-[10rem] pb-[5rem] mt-20'>
                    <h1 className={style.home__title}>
                        O’rganishning yangi yo’llari sari
                    </h1>
                    <p className={style.home__sub_title}>
                        AbuTolib platformasi - bu o’quvchilar uchun
                        online testlarni yaratish va sinovlardan o’tish
                        imkonini beradi. O’qish va o’rganishni
                        soddalashtiradi va samaradorligini oshiradi.
                    </p>
                    <Button className='mt-6'>
                        <span className={style.home__button_span}> Yangi hisob </span>
                    </Button>
                </div>
                <div className={style.home__rec}>
                    <img className={style.home__rec_img} src={image} alt="bratishka" />
                    <div className='-z-10 absolute bottom-0'>
                        <svg width="477" height="495" viewBox="0 0 477 495" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <ellipse cx="238.5" cy="247.5" rx="238.5" ry="247.5" fill="#00AAFF" />
                        </svg>
                    </div>
                </div>
            </div>

            <Card id='courses' className='w-full  mt-5 pt-20 flex flex-col'>
                <CardHeader>
                    <CardTitle className={style.courses__title}>
                        Popular Courses
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all">
                        <TabsList className='mx-auto'>
                            <TabsTrigger value="all">Barcha kurslar</TabsTrigger>
                            <TabsTrigger value="programmers">Dasturlash</TabsTrigger>
                            <TabsTrigger value="math">Matematika</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className='px-10 md:px-7'>
                            <Carousel className='pb-5'>
                                <CarouselContent >
                                    {data.map((item) => (
                                        <>
                                            <CarouselItem className="lg:basis-1/4 md:basis-1/3 sm:basis-1/2 mb-1">
                                                <Card className='w-[295px] px-4'>
                                                    <figure className='px-8'>
                                                        <img src={item.img} alt="" />
                                                    </figure>
                                                    <CardContent>
                                                        <span className={style.courses__corusel_span}>
                                                            {item.create}
                                                        </span>
                                                        <CardTitle className={style.courses__corusel_title}>
                                                            {item.title}
                                                        </CardTitle>
                                                        <CardDescription className={style.courses__corusel_describtion}>
                                                            {item.describtion}
                                                        </CardDescription>
                                                    </CardContent>
                                                    <CardFooter className='ml-auto'>
                                                        <Button>
                                                            Tashrif
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            </CarouselItem>
                                        </>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </TabsContent>
                        <TabsContent value="programmers">
                            Change your password here.
                            </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
            <Card>

            </Card>
        </>
    )
}