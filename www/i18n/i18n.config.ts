import AppHeader from './locales/components/AppHeader'
import AppFooter from './locales/components/AppFooter'
import BookingModal from './locales/components/BookingModal'
import TrustBanner from './locales/components/TrustBanner'
import Index from './locales/pages/Index'
import Suites from './locales/pages/Suites'
import Amenities from './locales/pages/Amenities'
import Explore from './locales/pages/Explore'
import Contact from './locales/pages/Contact'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      AppHeader: AppHeader.en,
      AppFooter: AppFooter.en,
      BookingModal: BookingModal.en,
      TrustBanner: TrustBanner.en,
      Index: Index.en,
      Suites: Suites.en,
      Amenities: Amenities.en,
      Explore: Explore.en,
      Contact: Contact.en
    },
    es: {
      AppHeader: AppHeader.es,
      AppFooter: AppFooter.es,
      BookingModal: BookingModal.es,
      TrustBanner: TrustBanner.es,
      Index: Index.es,
      Suites: Suites.es,
      Amenities: Amenities.es,
      Explore: Explore.es,
      Contact: Contact.es
    }
  }
}))
