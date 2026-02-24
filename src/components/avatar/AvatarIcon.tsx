interface AvatarIconProps {
  icon: string
  size?: number
  className?: string
}

/** icon が URL なら <img>、絵文字文字列ならそのまま <span> で表示 */
export function AvatarIcon({ icon, size = 40, className = "" }: AvatarIconProps) {
  if (icon.startsWith("http")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={icon}
        alt="avatar"
        width={size}
        height={size}
        className={`rounded-lg object-cover ${className}`}
      />
    )
  }
  return (
    <span className={`leading-none select-none ${className}`} style={{ fontSize: size * 0.7 }}>
      {icon}
    </span>
  )
}
