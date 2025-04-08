import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation"; // ✅ Import Navigation styles
import { Autoplay, FreeMode, Navigation, Pagination } from "swiper/modules"; // ✅ Correct import

import Course_Card from "./Course_Card";

const CourseSlider = ({ Courses }) => {
  const isLoopEnabled = Courses.length > 3; // ✅ Ensure enough slides for loop

  return (
    <>
      {Courses?.length ? (
        <Swiper
          slidesPerView={Math.min(3, Courses.length)} // ✅ Prevent exceeding available slides
          spaceBetween={25}
          loop={isLoopEnabled} // ✅ Loop only when slides are enough
          modules={[FreeMode, Pagination, Navigation, Autoplay]}
          navigation={isLoopEnabled} // ✅ Enable only if loop works
          autoplay={isLoopEnabled ? { delay: 2500, disableOnInteraction: false } : false} // ✅ Avoid issues
          breakpoints={{
            1024: {
              slidesPerView: Math.min(3, Courses.length), // ✅ Dynamic slidesPerView
            },
          }}
          className="max-h-[30rem]"
        >
          {Courses.map((course, i) => (
            <SwiperSlide key={i}>
              <Course_Card course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  );
};

export default CourseSlider;
