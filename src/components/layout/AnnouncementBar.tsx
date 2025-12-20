import { useTranslation } from "react-i18next";

export const AnnouncementBar = () => {
  const { t } = useTranslation('common');
  
  const announcements = [
    t('announcement.freeShipping', { defaultValue: 'شحن مجاني للطلبات بـ 499 ريال أو أكثر' }),
    t('announcement.freeShipping', { defaultValue: 'شحن مجاني للطلبات بـ 499 ريال أو أكثر' }),
    t('announcement.freeShipping', { defaultValue: 'شحن مجاني للطلبات بـ 499 ريال أو أكثر' }),
    t('announcement.freeShipping', { defaultValue: 'شحن مجاني للطلبات بـ 499 ريال أو أكثر' }),
  ];

  return (
    <div className="bg-announcement text-announcement-foreground overflow-hidden py-2.5">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...announcements, ...announcements].map((text, index) => (
          <span
            key={index}
            className="mx-8 text-sm font-medium"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};