interface VideoTileProps {
  name: string
  isHost?: boolean
}


export default function VideoTile({
  name,
  isHost = false
}: VideoTileProps) {

  return (
    <div
      className="
      bg-gray-900 
      border 
      border-gray-800 
      rounded-xl 
      h-64 
      flex 
      items-center 
      justify-center
      relative
      overflow-hidden
      "
    >

      {/* Fake video background */}
      <div
        className="
        absolute 
        inset-0 
        bg-gradient-to-br 
        from-blue-900/20 
        to-gray-900
        "
      />


      {/* User Avatar */}
      <div className="relative z-10 text-center">

        <div
          className="
          w-16 
          h-16 
          bg-blue-600 
          rounded-full 
          flex 
          items-center 
          justify-center 
          mx-auto 
          mb-3
          text-white
          text-xl
          font-semibold
          "
        >
          {name.charAt(0).toUpperCase()}
        </div>


        <p className="text-white font-medium">
          {name}
        </p>


        {
          isHost && (
            <p className="text-blue-400 text-xs mt-1">
              Host
            </p>
          )
        }

      </div>


    </div>
  )
}