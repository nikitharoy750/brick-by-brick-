import { motion } from "framer-motion";

type BrickPreviewProps = {
  colour: string;
  size: number;
};

export default function BrickPreview({
  colour,
  size,
}: BrickPreviewProps) {
  const width = 180 * size;
  const height = 75 * size;

  const outline = "#3A2525";

  return (
    <motion.div
      initial={{ scale: 1, y: 0 }}
      whileHover={{
        scale: 1.05,
        y: -3,
      }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 18,
      }}
      style={{
        width,
        height,
        position: "relative",
        flexShrink: 0,
      }}
      className="select-none"
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 180 75"
        role="img"
        aria-label="Pixel art brick"
        className="block"
      >
        {/* Pixel shadow */}
        <path
          d="M14 68h145v5H22z"
          fill="#000000"
          opacity="0.12"
        />

        {/* Thick pixel outline */}
        <path
          d="
            M16 7
            H166
            V12
            H174
            V62
            H166
            V68
            H16
            V63
            H9
            V14
            H16
            Z
          "
          fill={outline}
        />

        {/* Main brick */}
        <path
          d="
            M18 12
            H162
            V17
            H169
            V57
            H162
            V63
            H18
            V58
            H14
            V17
            H18
            Z
          "
          fill={colour}
        />

        {/* Fixed light pixel shading */}
        <path
          d="
            M18 12 H162 V19 H154 V24 H28 V20 H18 Z
            M28 25 H52 V30 H28 Z
            M112 20 H142 V25 H112 Z
            M65 33 H76 V38 H65 Z
            M145 31 H160 V36 H145 Z
          "
          fill="#FFFFFF"
          opacity="0.16"
        />

        {/* Fixed darker pixel shading */}
        <path
          d="
            M14 42 H34 V47 H58 V53 H48 V58 H18 V54 H14 Z
            M58 48 H70 V55 H58 Z
            M74 43 H102 V48 H95 V53 H83 V58 H68 V52 H74 Z
            M96 52 H112 V62 H96 Z
            M132 40 H169 V56 H161 V62 H138 V56 H132 Z
            M151 48 H169 V57 H151 Z
          "
          fill={outline}
          opacity="0.20"
        />
      </svg>
    </motion.div>
  );
}
