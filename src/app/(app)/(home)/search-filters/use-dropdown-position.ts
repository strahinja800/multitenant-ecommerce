import { RefObject } from 'react'

/**
 * Compute pixel coordinates to place a dropdown anchored to the provided element.
 *
 * If the referenced element is not available, returns { top: 0, left: 0 }.
 *
 * @param ref - A RefObject pointing to the anchor HTMLDivElement (may be `null`)
 * @returns An object exposing `getDropdownPosition`, which returns the dropdown's `top` and `left` coordinates (pixels) for placement within the viewport
 */
export default function useDropdownPosition(
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) {
  /**
   * Compute pixel coordinates for placing a dropdown anchored to the referenced element, adjusted to remain inside the viewport.
   *
   * @returns An object with `top` and `left` pixel coordinates for the dropdown. If the reference element is not available, returns `{ top: 0, left: 0 }`. When necessary, `left` is adjusted to prevent overflow and is clamped with a 16px viewport padding.
   */
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