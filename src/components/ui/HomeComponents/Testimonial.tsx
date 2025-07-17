import { useState, useEffect, useRef } from 'react';

const testimonials = [
  { 
    id: 1, 
    name: "Juilet Okafor", 
    location: "Lagos, Nigeria", 
    content: "The fitness equipment transformed my home workout experience. The quality is outstanding and delivery was seamless.", 
    rating: 5 
  },
  { 
    id: 2, 
    name: "Kwame Mensah", 
    location: "Accra, Ghana", 
    content: "I've recommended these products to all my clients. Professional-grade equipment at reasonable prices.", 
    rating: 5 
  },
  { 
    id: 3, 
    name: "Chioma Eze", 
    location: "Abuja, Nigeria", 
    content: "Equipped my entire gym with these products. Excellent durability and customer service.", 
    rating: 5 
  },
  { 
    id: 4, 
    name: "Yaw Boateng", 
    location: "Kumasi, Ghana", 
    content: "As a physical therapist, I appreciate the ergonomic design of these products. My patients love them!", 
    rating: 4 
  },
  { 
    id: 5, 
    name: "Daniel Adebayo", 
    location: "Port Harcourt, Nigeria", 
    content: "The customer support team was incredibly helpful when I had questions about assembly. Will buy again!", 
    rating: 5 
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Autoplay settings
  const autoplayDelay = 5000; // 5 seconds

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Start autoplay
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, autoplayDelay);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  // Pause autoplay when user interacts with slider
  const pauseAutoplay = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Resume autoplay after user interaction
  const resumeAutoplay = () => {
    setIsPaused(false);
  };

  // Determine which testimonials to show based on screen size
  const getVisibleTestimonials = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) {
        // Show 3 on large screens
        return [
          testimonials[currentIndex % testimonials.length],
          testimonials[(currentIndex + 1) % testimonials.length],
          testimonials[(currentIndex + 2) % testimonials.length]
        ];
      } else if (window.innerWidth >= 768) {
        // Show 2 on medium screens
        return [
          testimonials[currentIndex % testimonials.length],
          testimonials[(currentIndex + 1) % testimonials.length]
        ];
      }
    }
    // Default to 1 on small screens
    return [testimonials[currentIndex % testimonials.length]];
  };

  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our West African Clients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Hear from satisfied customers across Nigeria and Ghana</p>
        </div>

        <div 
          className="relative"
          onMouseEnter={pauseAutoplay}
          onMouseLeave={resumeAutoplay}
          onFocus={pauseAutoplay}
          onBlur={resumeAutoplay}
        >
          {/* Slider container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 transition-transform duration-300">
            {getVisibleTestimonials().map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start mb-4">
                  <svg className="w-6 h-6 text-blue-600 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <div>
                    <p className="text-gray-700 mb-4">&quot;{testimonial.content}&quot;</p>
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button 
            onClick={() => {
              prevSlide();
              pauseAutoplay();
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => {
              nextSlide();
              pauseAutoplay();
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                goToSlide(index);
                pauseAutoplay();
              }}
              className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}