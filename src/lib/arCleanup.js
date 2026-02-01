/**
 * AR.js Cleanup Utilities
 * 
 * Utility functions untuk membersihkan AR.js scene dengan benar
 * saat component unmount, mencegah memory leaks dan duplicate canvas.
 * 
 * CATATAN: File ini untuk referensi future jika AR.js digunakan kembali.
 * Saat ini project menggunakan LocationBasedChallenge, bukan AR.js.
 */

/**
 * Cleanup AR.js scene dan A-Frame entities
 * @param {string} sceneId - ID unik dari a-scene element
 */
export const cleanupARScene = (sceneId = "ar-scene") => {
  if (typeof window === "undefined") return;

  try {
    // 1. Ambil scene element
    const scene = document.getElementById(sceneId);
    if (!scene) return;

    // 2. Stop semua video streams (webcam)
    const videoElements = scene.querySelectorAll("video");
    videoElements.forEach((video) => {
      if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        video.srcObject = null;
      }
    });

    // 3. Remove event listeners dari markers
    const markers = scene.querySelectorAll("a-marker");
    markers.forEach((marker) => {
      marker.removeEventListener("markerFound", null);
      marker.removeEventListener("markerLost", null);
    });

    // 4. Pause scene untuk stop rendering loop
    if (scene.pause) {
      scene.pause();
    }

    // 5. Remove scene dari DOM
    scene.parentNode?.removeChild(scene);

    // 6. Cleanup A-Frame systems jika ada
    if (window.AFRAME && window.AFRAME.scenes) {
      window.AFRAME.scenes = window.AFRAME.scenes.filter(
        (s) => s.el.id !== sceneId
      );
    }

    console.log(`AR scene ${sceneId} cleaned up successfully`);
  } catch (error) {
    console.warn("Error cleaning up AR scene:", error);
  }
};

/**
 * Generate unique ID untuk AR scene
 * Mencegah duplicate canvas saat component re-mount
 */
export const generateARSceneId = () => {
  return `ar-scene-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check apakah AR.js scripts sudah loaded
 */
export const isARJSLoaded = () => {
  return typeof window !== "undefined" && window.AFRAME && window.THREEx;
};

/**
 * Example usage dalam React component:
 * 
 * ```jsx
 * import { useEffect, useRef } from "react";
 * import { cleanupARScene, generateARSceneId } from "@/lib/arCleanup";
 * 
 * export default function ARComponent() {
 *   const sceneIdRef = useRef(generateARSceneId());
 * 
 *   useEffect(() => {
 *     const sceneId = sceneIdRef.current;
 * 
 *     // Setup AR scene dengan unique ID
 *     // ...
 * 
 *     // Cleanup on unmount
 *     return () => {
 *       cleanupARScene(sceneId);
 *     };
 *   }, []);
 * 
 *   return (
 *     <a-scene id={sceneIdRef.current} embedded arjs>
 *       <a-marker preset="hiro">
 *         <a-box />
 *       </a-marker>
 *       <a-entity camera />
 *     </a-scene>
 *   );
 * }
 * ```
 */
