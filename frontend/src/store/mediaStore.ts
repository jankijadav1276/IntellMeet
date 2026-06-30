import { create } from "zustand"

interface MediaState {
  micOn: boolean
  cameraOn: boolean

  setMicOn: (value: boolean) => void
  setCameraOn: (value: boolean) => void

  reset: () => void
}

const useMediaStore = create<MediaState>((set) => ({
  micOn: true,
  cameraOn: true,

  setMicOn: (value) =>
    set({ micOn: value }),

  setCameraOn: (value) =>
    set({ cameraOn: value }),

  reset: () =>
    set({
      micOn: true,
      cameraOn: true,
    }),
}))

export default useMediaStore   