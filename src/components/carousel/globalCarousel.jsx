import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box,
  ActionIcon,
  Group
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';
import { 
  ChevronLeft, 
  ChevronRight,
  Circle,
  CircleDot
} from 'lucide-react';

function CarouselReutilizable({
  slides = [],
  interval = 5000,
  height = 400,
  showControls = true,
  showIndicators = true,
  autoPlay = true
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const intervalRef = useRef(null);
  const autoplayRef = useRef(autoPlay);
  const carouselRef = useRef(null);

  // Funciones de navegación simples
  const handleNext = useCallback(() => {
    setActiveSlide(prev => (prev < slides.length - 1 ? prev + 1 : 0));
  }, [slides.length]);

  const handlePrevious = useCallback(() => {
    setActiveSlide(prev => (prev > 0 ? prev - 1 : slides.length - 1));
  }, [slides.length]);

  const goToSlide = useCallback((index) => {
    setActiveSlide(index);
  }, []);

  // Autoplay
  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;

    const startAutoplay = () => {
      intervalRef.current = setInterval(() => {
        handleNext();
      }, interval);
    };

    startAutoplay();

    // Pausar al hover
    const carouselElement = document.querySelector('[data-carousel]');
    if (carouselElement) {
      const pauseAutoplay = () => clearInterval(intervalRef.current);
      const resumeAutoplay = () => {
        clearInterval(intervalRef.current);
        startAutoplay();
      };

      carouselElement.addEventListener('mouseenter', pauseAutoplay);
      carouselElement.addEventListener('mouseleave', resumeAutoplay);

      return () => {
        clearInterval(intervalRef.current);
        carouselElement.removeEventListener('mouseenter', pauseAutoplay);
        carouselElement.removeEventListener('mouseleave', resumeAutoplay);
      };
    }

    return () => clearInterval(intervalRef.current);
  }, [autoPlay, interval, slides.length, handleNext]);

  // Usamos el Carousel de Mantine pero controlamos manualmente el slide activo
  return (
    <Box
      data-carousel
      style={{
        position: 'relative',
        borderRadius: 'var(--border-radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--sombra-media)',
        backgroundColor: 'var(--color-blanco)',
        height: height,
      }}
    >
      <Carousel
        initialSlide={activeSlide}
        onSlideChange={setActiveSlide}
        withIndicators={false}
        withControls={false}
        loop
        height="100%"
        slideSize="100%"
        slideGap={0}
        align="start"
        styles={{
          root: {
            height: '100%',
          },
          viewport: {
            height: '100%',
          },
          container: {
            height: '100%',
          }
        }}
      >
        {slides.map((slide, index) => (
          <Carousel.Slide key={index}>
            <Box style={{ height: '100%', padding: '1rem' }}>
              {slide}
            </Box>
          </Carousel.Slide>
        ))}
      </Carousel>

      {/* Controles personalizados */}
      {showControls && slides.length > 1 && (
        <>
          <ActionIcon
            variant="filled"
            color="var(--color-botones)"
            size="lg"
            radius="xl"
            onClick={handlePrevious}
            style={{
              position: 'absolute',
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              backgroundColor: 'var(--color-botones)',
              opacity: 0.8,
              ':hover': {
                opacity: 1,
                backgroundColor: 'var(--color-botones-hover)',
              },
              '@media (maxWidth: 768px)': {
                left: 10,
                width: 40,
                height: 40,
              }
            }}
          >
            <ChevronLeft size={20} />
          </ActionIcon>

          <ActionIcon
            variant="filled"
            color="var(--color-botones)"
            size="lg"
            radius="xl"
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              backgroundColor: 'var(--color-botones)',
              opacity: 0.8,
              ':hover': {
                opacity: 1,
                backgroundColor: 'var(--color-botones-hover)',
              },
              '@media (maxWidth: 768px)': {
                right: 10,
                width: 40,
                height: 40,
              }
            }}
          >
            <ChevronRight size={20} />
          </ActionIcon>
        </>
      )}

      {/* Indicadores personalizados */}
      {showIndicators && slides.length > 1 && (
        <Group
          justify="center"
          gap="xs"
          style={{
            position: 'absolute',
            bottom: 20,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          {slides.map((_, index) => (
            <ActionIcon
              key={index}
              variant="transparent"
              color="gray"
              onClick={() => goToSlide(index)}
              style={{
                padding: 0,
                width: 12,
                height: 12,
                cursor: 'pointer',
              }}
            >
              {index === activeSlide ? (
                <CircleDot 
                  size={14} 
                  color="var(--color-botones)" 
                  fill="var(--color-botones)"
                />
              ) : (
                <Circle 
                  size={12} 
                  color="var(--color-texto-claro)" 
                />
              )}
            </ActionIcon>
          ))}
        </Group>
      )}
    </Box>
  );
}

export default CarouselReutilizable;