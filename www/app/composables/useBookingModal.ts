/**
 * Global open/close state for the Book Now modal (Airbnb / Vrbo picker).
 * The modal itself is mounted once in layouts/default.vue; any CTA can
 * open it via `useBookingModal().open()`.
 */
export function useBookingModal() {
  const isOpen = useState('booking-modal-open', () => false)

  return {
    isOpen,
    open: () => { isOpen.value = true },
    close: () => { isOpen.value = false }
  }
}
