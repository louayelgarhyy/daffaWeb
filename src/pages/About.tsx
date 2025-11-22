import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Award, Users, Heart, Shield } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const About = () => {
  const { t, i18n } = useTranslation(['about', 'common']);
  const isRTL = i18n.language === 'ar';
  const [isLoading, setIsLoading] = useState(false);

  const heroRef = useScrollAnimation({ threshold: 0.2 });
  const missionRef = useScrollAnimation({ threshold: 0.2 });
  const valuesRef = useScrollAnimation({ threshold: 0.2 });
  const storyRef = useScrollAnimation({ threshold: 0.2 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <PageTransition>
        <LoadingSpinner />
      </PageTransition>
    );
  }

  const values = [
    {
      icon: Award,
      key: 'quality',
      title: t('about:values.quality.title'),
      description: t('about:values.quality.description'),
    },
    {
      icon: Users,
      key: 'craftsmanship',
      title: t('about:values.craftsmanship.title'),
      description: t('about:values.craftsmanship.description'),
    },
    {
      icon: Heart,
      key: 'authenticity',
      title: t('about:values.authenticity.title'),
      description: t('about:values.authenticity.description'),
    },
    {
      icon: Shield,
      key: 'service',
      title: t('about:values.service.title'),
      description: t('about:values.service.description'),
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section
          ref={heroRef.elementRef}
          className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24"
        >
          <div
            className={`container px-4 transition-all duration-1000 ${
            heroRef.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {t('about:hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t('about:hero.subtitle')}
            </p>
          </div>
        </div>
        </section>

        {/* Mission Section */}
        <section
          ref={missionRef.elementRef}
          className="py-16 md:py-24"
        >
          <div
            className={`container px-4 transition-all duration-1000 ${
            missionRef.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
              {t('about:mission.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed text-center">
              {t('about:mission.description')}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed text-center">
              {t('about:mission.subtitle')}
            </p>
          </div>
        </div>
        </section>

        {/* Values Section */}
        <section
          ref={valuesRef.elementRef}
          className="py-16 md:py-24 bg-card-secondary"
        >
          <div className="container px-4">
          <h2
            className={`text-3xl md:text-4xl font-bold text-foreground mb-12 text-center transition-all duration-1000 ${
              valuesRef.isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-20'
            }`}
          >
            {t('about:values.title')}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.key}
                  className={`bg-card border border-border rounded-lg p-6 text-center transition-all duration-700 ${
                    valuesRef.isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-20'
                  }`}
                  style={{
                    transitionDelay: valuesRef.isVisible ? `${index * 100}ms` : '0ms'
                  }}
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        </section>

        {/* Story Section */}
        <section
          ref={storyRef.elementRef}
          className="py-16 md:py-24"
        >
        <div
          className={`container px-4 transition-all duration-1000 ${
            storyRef.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
              {t('about:story.title')}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-center">
              {t('about:story.description')}
            </p>
          </div>
        </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default About;
