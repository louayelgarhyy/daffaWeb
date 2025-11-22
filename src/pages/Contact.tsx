import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageTransition } from "@/components/PageTransition";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

// Contact form schema
const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'contact:validation.nameRequired')
    .min(2, 'contact:validation.nameMin'),
  email: z
    .string()
    .min(1, 'contact:validation.emailRequired')
    .email('contact:validation.emailInvalid'),
  phone: z
    .string()
    .min(1, 'contact:validation.phoneRequired')
    .regex(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, 'contact:validation.phoneInvalid'),
  subject: z
    .string()
    .min(1, 'contact:validation.subjectRequired'),
  message: z
    .string()
    .min(1, 'contact:validation.messageRequired')
    .min(10, 'contact:validation.messageMin'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const Contact = () => {
  const { t, i18n } = useTranslation(['contact', 'common']);
  const isRTL = i18n.language === 'ar';
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const heroRef = useScrollAnimation({ threshold: 0.2 });
  const formRef = useScrollAnimation({ threshold: 0.2 });
  const infoRef = useScrollAnimation({ threshold: 0.2 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Contact form submitted:', data);
    toast.success(t('contact:success'));
    reset();
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <PageTransition>
        <LoadingSpinner />
      </PageTransition>
    );
  }

  const contactInfo = [
    {
      icon: Phone,
      title: t('contact:info.phone.title'),
      value: t('contact:info.phone.value'),
    },
    {
      icon: Mail,
      title: t('contact:info.email.title'),
      value: t('contact:info.email.value'),
    },
    {
      icon: MapPin,
      title: t('contact:info.address.title'),
      value: t('contact:info.address.value'),
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
              {t('contact:hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t('contact:hero.subtitle')}
            </p>
          </div>
        </div>
        </section>

        {/* Contact Info Cards */}
        <section
          ref={infoRef.elementRef}
          className="py-16 md:py-20"
        >
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div
                  key={info.title}
                  className={`bg-card border border-border rounded-lg p-6 text-center transition-all duration-700 ${
                    infoRef.isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-20'
                  }`}
                  style={{
                    transitionDelay: infoRef.isVisible ? `${index * 100}ms` : '0ms'
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {info.title}
                  </h3>
                  <p className="text-muted-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
                    {info.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        </section>

        {/* Contact Form */}
        <section
          ref={formRef.elementRef}
          className="py-16 md:py-20 bg-card-secondary"
        >
        <div className="container px-4">
          <div
            className={`max-w-2xl mx-auto transition-all duration-1000 ${
              formRef.isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-20'
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              {t('contact:form.title')}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-lg p-6 md:p-8">
              <div className="space-y-6">
                {/* Name Field */}
                <div
                  className={`transition-all duration-700 ${
                    formRef.isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: formRef.isVisible ? '100ms' : '0ms' }}
                >
                  <Label htmlFor="name">{t('contact:form.name')}</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder={t('contact:form.namePlaceholder')}
                    className="mt-2"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {t(errors.name.message as string)}
                    </p>
                  )}
                </div>

                {/* Email & Phone Row */}
                <div
                  className={`grid md:grid-cols-2 gap-6 transition-all duration-700 ${
                    formRef.isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: formRef.isVisible ? '200ms' : '0ms' }}
                >
                  <div>
                    <Label htmlFor="email">{t('contact:form.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder={t('contact:form.emailPlaceholder')}
                      className="mt-2"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {t(errors.email.message as string)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">{t('contact:form.phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      placeholder={t('contact:form.phonePlaceholder')}
                      className="mt-2"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">
                        {t(errors.phone.message as string)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject Field */}
                <div
                  className={`transition-all duration-700 ${
                    formRef.isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: formRef.isVisible ? '300ms' : '0ms' }}
                >
                  <Label htmlFor="subject">{t('contact:form.subject')}</Label>
                  <Input
                    id="subject"
                    {...register('subject')}
                    placeholder={t('contact:form.subjectPlaceholder')}
                    className="mt-2"
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive mt-1">
                      {t(errors.subject.message as string)}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div
                  className={`transition-all duration-700 ${
                    formRef.isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: formRef.isVisible ? '400ms' : '0ms' }}
                >
                  <Label htmlFor="message">{t('contact:form.message')}</Label>
                  <Textarea
                    id="message"
                    {...register('message')}
                    placeholder={t('contact:form.messagePlaceholder')}
                    rows={6}
                    className="mt-2 resize-none"
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive mt-1">
                      {t(errors.message.message as string)}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div
                  className={`transition-all duration-700 ${
                    formRef.isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: formRef.isVisible ? '500ms' : '0ms' }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('contact:form.sending') : t('contact:form.submit')}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Contact;
