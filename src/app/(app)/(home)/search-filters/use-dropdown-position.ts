import { RefObject } from 'react'

//TODO: implement dropdown positioning logic
export default function useDropdownPosition(
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) {
  function getDropdownPosition() {
    if (!ref.current) return { top: 0, left: 0 }

    const rect = ref.current.getBoundingClientRect() // rect = rectangle
    const dropdownWidth = 240 // width of dropdown (w-60 => 15rem => 240px) !!!!!!

    // Initial position
    let left = rect.left + window.scrollX
    const top = rect.bottom + window.scrollY

    // check if dropdown would go off the right edge
    if (left + dropdownWidth > window.innerWidth) {
      // Align to right edge of button
      left = rect.right + window.scrollX - dropdownWidth

      // if off, align to left edge of viewport
      if (left < 0) {
        left = window.innerWidth - dropdownWidth - 16 // 16px padding
      }

      // dropdown doesnt off left edge
      if (left < 0) {
        left = 16 // padding
      }
    }

    return { top, left }
  }

  return { getDropdownPosition }
}
