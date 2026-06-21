import React from 'react';
import Svg, {
  Circle, Ellipse, Path, Rect, Defs, RadialGradient, LinearGradient, Stop,
} from 'react-native-svg';

interface Props { size?: number; }

// 플라톤 — RPG 전설급 카드풍
// 파란/보라 빛 테두리, 별빛 배경, 넓은 이마+웨이브머리+수염
export default function PlatoAvatar({ size = 120 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <RadialGradient id="pBg" cx="50%" cy="40%" r="60%">
          <Stop offset="0%"  stopColor="#0A0828" />
          <Stop offset="60%" stopColor="#040412" />
          <Stop offset="100%" stopColor="#020208" />
        </RadialGradient>
        <RadialGradient id="pGlow" cx="35%" cy="22%" r="68%">
          <Stop offset="0%"  stopColor="#90B0FF" stopOpacity="0.9" />
          <Stop offset="40%" stopColor="#4060E0" stopOpacity="0.5" />
          <Stop offset="100%" stopColor="#000820" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="pRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%"   stopColor="#C0D8FF" />
          <Stop offset="25%"  stopColor="#5080E0" />
          <Stop offset="50%"  stopColor="#1830A0" />
          <Stop offset="75%"  stopColor="#5080E0" />
          <Stop offset="100%" stopColor="#C0D8FF" />
        </LinearGradient>
        <RadialGradient id="pFace" cx="30%" cy="26%" r="70%">
          <Stop offset="0%"  stopColor="#D4A870" />
          <Stop offset="38%" stopColor="#907040" />
          <Stop offset="72%" stopColor="#4A2C10" />
          <Stop offset="100%" stopColor="#120800" />
        </RadialGradient>
        <LinearGradient id="pHair" x1="25%" y1="0%" x2="85%" y2="100%">
          <Stop offset="0%"  stopColor="#2A2010" />
          <Stop offset="40%" stopColor="#100A04" />
          <Stop offset="100%" stopColor="#040200" />
        </LinearGradient>
        <LinearGradient id="pBeard" x1="28%" y1="0%" x2="85%" y2="100%">
          <Stop offset="0%"  stopColor="#1E1808" />
          <Stop offset="45%" stopColor="#0C0804" />
          <Stop offset="100%" stopColor="#020100" />
        </LinearGradient>
        <LinearGradient id="pRobe" x1="28%" y1="0%" x2="88%" y2="100%">
          <Stop offset="0%"  stopColor="#2840C0" />
          <Stop offset="42%" stopColor="#101870" />
          <Stop offset="100%" stopColor="#020410" />
        </LinearGradient>
        <RadialGradient id="pStarBg" cx="65%" cy="28%" r="45%">
          <Stop offset="0%"  stopColor="#1828A0" stopOpacity="0.5" />
          <Stop offset="100%" stopColor="#000010" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* 파란 외곽 글로우 */}
      <Circle cx="100" cy="100" r="99" fill="#3050C0" opacity="0.5" />
      <Circle cx="100" cy="100" r="97" fill="#80A8FF" opacity="0.2" />
      <Circle cx="100" cy="100" r="96" fill="url(#pRim)" />
      <Circle cx="100" cy="100" r="93" fill="url(#pBg)" />
      <Circle cx="100" cy="100" r="93" fill="url(#pGlow)" />
      <Circle cx="100" cy="100" r="93" fill="url(#pStarBg)" />

      {/* 별빛 */}
      <Circle cx="162" cy="22" r="2.5" fill="#FFFFFF" opacity="0.85" />
      <Circle cx="175" cy="38" r="1.5" fill="#A0C0FF" opacity="0.8" />
      <Circle cx="155" cy="32" r="1"   fill="#FFFFFF" opacity="0.7" />
      <Circle cx="180" cy="58" r="1.2" fill="#C0D4FF" opacity="0.65" />
      <Circle cx="168" cy="52" r="0.8" fill="#FFFFFF" opacity="0.6" />
      <Circle cx="24"  cy="36" r="1.8" fill="#FFFFFF" opacity="0.55" />
      <Circle cx="18"  cy="62" r="1"   fill="#A0B8FF" opacity="0.6" />
      <Circle cx="30"  cy="72" r="0.8" fill="#FFFFFF" opacity="0.5" />
      <Circle cx="178" cy="90" r="1.2" fill="#C0D0FF" opacity="0.5" />
      <Circle cx="20"  cy="148" r="1"  fill="#FFFFFF" opacity="0.4" />
      {/* 이데아 원 */}
      <Circle cx="168" cy="30" r="14" fill="none" stroke="#4060D0" strokeWidth="1.5" opacity="0.5" />
      <Circle cx="168" cy="30" r="9"  fill="none" stroke="#6080F0" strokeWidth="1"   opacity="0.45" />
      <Circle cx="168" cy="30" r="4"  fill="#7090FF" opacity="0.5" />
      <Circle cx="168" cy="30" r="1.5" fill="#C0D0FF" opacity="0.8" />
      {/* 코너 장식 */}
      <Circle cx="18" cy="18" r="8" fill="none" stroke="#3060C0" strokeWidth="1.5" opacity="0.55" />
      <Circle cx="18" cy="18" r="4" fill="none" stroke="#5080E0" strokeWidth="1"   opacity="0.5" />
      <Circle cx="182" cy="182" r="8" fill="none" stroke="#3060C0" strokeWidth="1.5" opacity="0.4" />

      {/* 로브 */}
      <Path d="M6 196 Q44 158 100 144 Q156 158 194 196 L200 200 L0 200Z" fill="url(#pRobe)" />
      <Path d="M28 193 Q62 168 100 158" stroke="#3858C8" strokeWidth="1.2" fill="none" opacity="0.7" />
      {/* 클라스프 */}
      <Circle cx="100" cy="156" r="9"   fill="#0C1880" />
      <Circle cx="100" cy="156" r="7"   fill="#2040C0" />
      <Circle cx="100" cy="156" r="4.5" fill="#4868E0" />
      <Circle cx="100" cy="156" r="2"   fill="#90B0FF" />
      <Circle cx="99"  cy="155" r="1"   fill="#FFFFFF" opacity="0.9" />

      {/* 목 */}
      <Path d="M82 138 Q100 132 118 138 L121 154 Q100 160 79 154Z" fill="#341A08" />

      {/* 귀 */}
      <Path d="M54 100 Q47 107 49 118 Q52 126 58 123 Q52 116 55 108Z" fill="#2A1206" />
      <Path d="M146 100 Q153 107 151 118 Q148 126 142 123 Q148 116 145 108Z" fill="#1C0E04" />

      {/* 얼굴 */}
      <Path d="M54 100 Q51 128 57 150 Q72 170 100 174 Q128 170 143 150 Q149 128 146 100 Q129 80 100 76 Q71 80 54 100Z"
        fill="url(#pFace)" />

      {/* 넓은 이마 하이라이트 */}
      <Ellipse cx="80" cy="90" rx="28" ry="16" fill="#8090FF" opacity="0.1"  />
      <Ellipse cx="72" cy="83" rx="16" ry="10" fill="#B0C8FF" opacity="0.12" />

      {/* 풍성한 웨이브 머리 */}
      <Path d="M54 100 Q44 74 52 50 Q62 26 82 18 Q60 36 58 66 Q56 82 58 98Z"   fill="url(#pHair)" />
      <Path d="M146 100 Q156 74 148 50 Q138 26 118 18 Q140 36 142 66 Q144 82 142 98Z" fill="url(#pHair)" />
      <Path d="M58 98 Q62 68 74 46 Q86 24 100 18 Q114 24 126 46 Q138 68 142 98" fill="url(#pHair)" />
      {/* 웨이브 하이라이트 */}
      <Path d="M62 86 Q68 60 78 42 Q88 24 100 20" stroke="#4A3818" strokeWidth="2.5" fill="none" opacity="0.55" />
      <Path d="M60 68 Q66 48 76 34 Q84 22 94 18" stroke="#382C10" strokeWidth="1.5" fill="none" opacity="0.45" />
      <Path d="M138 86 Q132 60 122 42 Q112 24 100 20" stroke="#3A2C10" strokeWidth="2"   fill="none" opacity="0.5" />
      <Path d="M68 92 Q64 68 70 50" stroke="#1E1608" strokeWidth="1.5" fill="none" opacity="0.6" />
      <Path d="M132 92 Q136 68 130 50" stroke="#161008" strokeWidth="1.5" fill="none" opacity="0.55" />

      {/* 눈썹 */}
      <Path d="M60 90 Q73 82 88 87"   stroke="#20140A" strokeWidth="5"   strokeLinecap="round" fill="none" />
      <Path d="M112 87 Q127 82 140 90" stroke="#20140A" strokeWidth="5"   strokeLinecap="round" fill="none" />
      <Path d="M61 89 Q73 81 87 86"   stroke="#5070D8" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.45" />
      <Path d="M113 86 Q127 81 139 89" stroke="#4060C8" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"  />

      {/* 눈 — 파란 빛 반사 */}
      <Ellipse cx="77" cy="100" rx="14" ry="11.5" fill="#080618" />
      <Ellipse cx="123" cy="100" rx="14" ry="11.5" fill="#060412" />
      <Circle cx="78"  cy="100" r="9"   fill="#060E40" />
      <Circle cx="124" cy="100" r="9"   fill="#040B30" />
      <Circle cx="78"  cy="100" r="6.5" fill="#1030A8" />
      <Circle cx="124" cy="100" r="6.5" fill="#0C2888" />
      <Circle cx="78"  cy="100" r="3.5" fill="#020410" />
      <Circle cx="124" cy="100" r="3.5" fill="#020310" />
      <Ellipse cx="72" cy="93" rx="4.5" ry="3"  fill="#80B0FF" opacity="0.9" />
      <Circle  cx="70" cy="91" r="2"            fill="#FFFFFF"  opacity="0.98" />
      <Ellipse cx="118" cy="94" rx="3.2" ry="2.2" fill="#6090E0" opacity="0.7" />
      <Circle  cx="117" cy="93" r="1.2"          fill="#FFFFFF"  opacity="0.85" />
      <Path d="M63 96 Q77 88 91 96"   stroke="#180E06" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d="M109 96 Q123 88 137 96" stroke="#100A04" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d="M64 110 Q77 114 91 110"  stroke="#140A04" strokeWidth="1.5" fill="none" opacity="0.55" />
      <Path d="M109 110 Q122 114 136 110" stroke="#100804" strokeWidth="1.5" fill="none" opacity="0.5" />

      {/* 코 */}
      <Path d="M96 98 L93 124 Q100 131 107 124 L104 98 Q100 94 96 98Z" fill="#3A1C08" />
      <Path d="M97 98 Q100 93 103 98" stroke="#705028" strokeWidth="1.5" fill="none" />
      <Ellipse cx="91" cy="124" rx="8.5" ry="5.5" fill="#261208" />
      <Ellipse cx="109" cy="124" rx="8.5" ry="5.5" fill="#1C0E06" />
      <Ellipse cx="91" cy="125" rx="4.5" ry="3.2" fill="#0E0600" />
      <Ellipse cx="109" cy="125" rx="4.5" ry="3.2" fill="#0A0400" />
      <Ellipse cx="99" cy="110" rx="3" ry="5.5" fill="#6080D0" opacity="0.18" />

      {/* 수염 */}
      <Path d="M57 138 Q50 158 57 178 Q72 196 100 198 Q128 196 143 178 Q150 158 143 138 Q126 152 100 156 Q74 152 57 138Z"
        fill="url(#pBeard)" />
      <Path d="M64 142 Q57 162 64 180 Q73 193 87 197" stroke="#302818" strokeWidth="1.5" fill="none" opacity="0.5" />
      <Path d="M100 156 Q98 176 100 196"              stroke="#242010" strokeWidth="1.5" fill="none" opacity="0.45" />
      <Path d="M136 142 Q143 162 136 180 Q127 193 113 197" stroke="#1C1608" strokeWidth="1.2" fill="none" opacity="0.42" />
      <Path d="M68 144 Q61 164 68 182" stroke="#382E18" strokeWidth="1.5" fill="none" opacity="0.4" />
      {/* 콧수염 */}
      <Path d="M80 136 Q90 129 100 132 Q110 129 120 136 Q110 143 100 141 Q90 143 80 136Z" fill="#181008" />

      {/* 그림자 */}
      <Path d="M54 100 Q51 128 57 150" stroke="#060410" strokeWidth="6" fill="none" opacity="0.7" />
      <Path d="M146 100 Q149 128 143 150" stroke="#040210" strokeWidth="8" fill="none" opacity="0.6" />
      <Ellipse cx="64" cy="112" rx="14" ry="10" fill="#4060C0" opacity="0.08" />

      {/* 내부 장식 테두리 */}
      <Circle cx="100" cy="100" r="91" fill="none" stroke="#2040B0" strokeWidth="1.5" opacity="0.5" />
      <Circle cx="100" cy="100" r="88" fill="none" stroke="#1830A0" strokeWidth="0.7" opacity="0.35" />
    </Svg>
  );
}
