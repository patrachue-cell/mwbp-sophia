import React from 'react';
import Svg, {
  Circle, Ellipse, Path, Rect, Defs, RadialGradient, LinearGradient, Stop, Polygon,
} from 'react-native-svg';

interface Props { size?: number; }

// 소크라테스 — RPG 전설급 카드풍
// 황금 빛 테두리, 불꽃 배경, 납작 들창코+대머리+흰수염, 현자 이미지
export default function SocratesAvatar({ size = 120 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        {/* 배경 — 짙은 황금빛 그라데이션 */}
        <RadialGradient id="sBg" cx="50%" cy="40%" r="60%">
          <Stop offset="0%"  stopColor="#3A2200" />
          <Stop offset="60%" stopColor="#1A0E00" />
          <Stop offset="100%" stopColor="#0A0600" />
        </RadialGradient>
        {/* 드라마틱 조명 */}
        <RadialGradient id="sGlow" cx="38%" cy="25%" r="70%">
          <Stop offset="0%"  stopColor="#FFB040" stopOpacity="0.95" />
          <Stop offset="45%" stopColor="#E07010" stopOpacity="0.55" />
          <Stop offset="100%" stopColor="#400800" stopOpacity="0" />
        </RadialGradient>
        {/* 황금 테두리 그라데이션 */}
        <LinearGradient id="sRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%"   stopColor="#FFF0A0" />
          <Stop offset="25%"  stopColor="#E0A820" />
          <Stop offset="50%"  stopColor="#A06000" />
          <Stop offset="75%"  stopColor="#E0A820" />
          <Stop offset="100%" stopColor="#FFF0A0" />
        </LinearGradient>
        {/* 얼굴 */}
        <RadialGradient id="sFace" cx="32%" cy="28%" r="68%">
          <Stop offset="0%"  stopColor="#E8A860" />
          <Stop offset="40%" stopColor="#B07030" />
          <Stop offset="75%" stopColor="#6A3808" />
          <Stop offset="100%" stopColor="#1E0800" />
        </RadialGradient>
        {/* 두피 */}
        <RadialGradient id="sScalp" cx="30%" cy="22%" r="65%">
          <Stop offset="0%"  stopColor="#D09040" />
          <Stop offset="55%" stopColor="#804A10" />
          <Stop offset="100%" stopColor="#200A00" />
        </RadialGradient>
        {/* 수염 */}
        <LinearGradient id="sBeard" x1="28%" y1="0%" x2="85%" y2="100%">
          <Stop offset="0%"  stopColor="#E0D8C8" />
          <Stop offset="35%" stopColor="#A09880" />
          <Stop offset="75%" stopColor="#504030" />
          <Stop offset="100%" stopColor="#100800" />
        </LinearGradient>
        {/* 로브 */}
        <LinearGradient id="sRobe" x1="28%" y1="0%" x2="90%" y2="100%">
          <Stop offset="0%"  stopColor="#6A5828" />
          <Stop offset="45%" stopColor="#2A2010" />
          <Stop offset="100%" stopColor="#060400" />
        </LinearGradient>
        {/* 불꽃 배경 글로우 */}
        <RadialGradient id="sFlameGlow" cx="50%" cy="85%" r="55%">
          <Stop offset="0%"  stopColor="#FF6000" stopOpacity="0.4" />
          <Stop offset="60%" stopColor="#E03000" stopOpacity="0.15" />
          <Stop offset="100%" stopColor="#800000" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* 황금 외곽 글로우 */}
      <Circle cx="100" cy="100" r="99" fill="#E8A000" opacity="0.6" />
      <Circle cx="100" cy="100" r="97" fill="#FFF080" opacity="0.25" />
      {/* 황금 테두리 */}
      <Circle cx="100" cy="100" r="96" fill="url(#sRim)" />
      <Circle cx="100" cy="100" r="93" fill="url(#sBg)" />
      {/* 조명 + 불꽃 글로우 */}
      <Circle cx="100" cy="100" r="93" fill="url(#sGlow)" />
      <Circle cx="100" cy="100" r="93" fill="url(#sFlameGlow)" />

      {/* ── 배경 장식 ── */}
      {/* 불꽃들 */}
      <Path d="M50 185 Q44 168 50 154 Q53 168 50 185Z" fill="#FF8020" opacity="0.45" />
      <Path d="M54 192 Q46 172 54 156 Q58 174 54 192Z" fill="#FF5000" opacity="0.35" />
      <Path d="M148 185 Q154 168 150 154 Q147 168 148 185Z" fill="#FF8020" opacity="0.45" />
      <Path d="M144 192 Q152 172 146 156 Q142 174 144 192Z" fill="#FF5000" opacity="0.35" />
      {/* 코너 룬 문양 */}
      <Circle cx="18" cy="18" r="8" fill="none" stroke="#E8A020" strokeWidth="1.5" opacity="0.6" />
      <Circle cx="18" cy="18" r="4" fill="none" stroke="#FFC040" strokeWidth="1" opacity="0.5" />
      <Circle cx="182" cy="18" r="8" fill="none" stroke="#E8A020" strokeWidth="1.5" opacity="0.6" />
      <Circle cx="182" cy="18" r="4" fill="none" stroke="#FFC040" strokeWidth="1" opacity="0.5" />
      {/* 빛 입자들 */}
      <Circle cx="30"  cy="55" r="1.5" fill="#FFD060" opacity="0.7" />
      <Circle cx="22"  cy="90" r="1"   fill="#FFA030" opacity="0.6" />
      <Circle cx="170" cy="48" r="1.8" fill="#FFD060" opacity="0.65" />
      <Circle cx="178" cy="85" r="1"   fill="#FFA030" opacity="0.55" />
      <Circle cx="35"  cy="170" r="1.5" fill="#FF6010" opacity="0.5" />
      <Circle cx="165" cy="175" r="1.2" fill="#FF6010" opacity="0.45" />

      {/* ── 로브 ── */}
      <Path d="M6 196 Q44 158 100 144 Q156 158 194 196 L200 200 L0 200Z" fill="url(#sRobe)" />
      <Path d="M28 193 Q60 166 100 156" stroke="#8A7030" strokeWidth="1.2" fill="none" opacity="0.7" />
      <Path d="M172 193 Q140 166 100 156" stroke="#5A4818" strokeWidth="1" fill="none" opacity="0.5" />
      {/* 브로치 */}
      <Circle cx="100" cy="155" r="9"   fill="#B07808" />
      <Circle cx="100" cy="155" r="7"   fill="#E8A820" />
      <Circle cx="100" cy="155" r="4.5" fill="#FFC840" />
      <Circle cx="100" cy="155" r="2"   fill="#FFE880" />
      <Circle cx="99"  cy="154" r="0.9" fill="#FFFFFF" opacity="0.9" />

      {/* ── 목 ── */}
      <Path d="M82 136 Q100 130 118 136 L121 152 Q100 158 79 152Z" fill="#6A3810" />

      {/* ── 귀 ── */}
      <Path d="M53 95 Q46 102 48 114 Q51 122 57 119 Q51 113 54 106Z" fill="#3A1C06" />
      <Path d="M147 95 Q154 102 152 114 Q149 122 143 119 Q149 113 146 106Z" fill="#280E04" />

      {/* ── 얼굴 ── */}
      <Path d="M54 98 Q50 126 57 148 Q72 168 100 172 Q128 168 143 148 Q150 126 146 98 Q130 78 100 74 Q70 78 54 98Z"
        fill="url(#sFace)" />

      {/* ── 대머리 두피 ── */}
      <Path d="M54 98 Q56 64 70 44 Q82 26 100 22 Q118 26 130 44 Q144 64 146 98 Q128 84 100 80 Q72 84 54 98Z"
        fill="url(#sScalp)" />
      {/* 두피 하이라이트 */}
      <Ellipse cx="78" cy="48" rx="24" ry="15" fill="#FFD060" opacity="0.2"  />
      <Ellipse cx="70" cy="38" rx="13" ry="8"  fill="#FFFFFF" opacity="0.12" />
      {/* 두피 주름 */}
      <Path d="M60 88 Q74 80 92 84"  stroke="#200A00" strokeWidth="1.2" fill="none" opacity="0.7" />
      <Path d="M62 100 Q76 93 94 97" stroke="#180800" strokeWidth="1"   fill="none" opacity="0.5" />

      {/* ── 눈썹 ── */}
      <Path d="M60 86 Q73 78 88 83"  stroke="#3A1C06" strokeWidth="5"   strokeLinecap="round" fill="none" />
      <Path d="M112 83 Q127 78 140 86" stroke="#3A1C06" strokeWidth="5" strokeLinecap="round" fill="none" />
      <Path d="M61 85 Q73 77 87 82"  stroke="#C08028" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6" />
      <Path d="M113 82 Q128 77 139 85" stroke="#A06020" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />

      {/* ── 눈 ── */}
      <Ellipse cx="77" cy="97" rx="14" ry="11"  fill="#120800" />
      <Ellipse cx="123" cy="97" rx="14" ry="11" fill="#0C0600" />
      <Circle cx="78"  cy="97" r="9"   fill="#3C1E00" />
      <Circle cx="124" cy="97" r="9"   fill="#301800" />
      <Circle cx="78"  cy="97" r="6.5" fill="#6A3C08" />
      <Circle cx="124" cy="97" r="6.5" fill="#583208" />
      <Circle cx="78"  cy="97" r="3.5" fill="#080200" />
      <Circle cx="124" cy="97" r="3.5" fill="#060200" />
      {/* 빛 반사 — 황금빛 */}
      <Ellipse cx="72" cy="91" rx="4.5" ry="3"  fill="#FFB840" opacity="0.85" />
      <Circle  cx="70" cy="89" r="2"            fill="#FFFFFF"  opacity="0.95" />
      <Ellipse cx="118" cy="92" rx="3" ry="2"   fill="#E09030"  opacity="0.65" />
      <Circle  cx="117" cy="91" r="1.2"         fill="#FFFFFF"  opacity="0.8"  />
      {/* 눈꺼풀 */}
      <Path d="M63 93 Q77 85 91 93"   stroke="#1E0A00" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d="M109 93 Q123 85 137 93" stroke="#160800" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d="M64 106 Q77 110 91 106"  stroke="#180800" strokeWidth="1.5" fill="none" opacity="0.6" />
      <Path d="M109 106 Q122 110 136 106" stroke="#100600" strokeWidth="1.5" fill="none" opacity="0.5" />

      {/* ── 납작 들창코 (소크라테스 최대 특징) ── */}
      <Path d="M93 94 L89 122 Q100 131 111 122 L107 94 Q100 90 93 94Z" fill="#5A2C08" />
      <Path d="M95 94 Q100 88 105 94" stroke="#C07828" strokeWidth="1.5" fill="none" />
      <Ellipse cx="87"  cy="122" rx="12" ry="8"   fill="#3E1806" />
      <Ellipse cx="113" cy="122" rx="12" ry="8"   fill="#301408" />
      <Ellipse cx="87"  cy="123" rx="6"  ry="4.5" fill="#180800" />
      <Ellipse cx="113" cy="123" rx="6"  ry="4.5" fill="#140600" />
      <Ellipse cx="99"  cy="107" rx="4"  ry="6"   fill="#E08840" opacity="0.3" />

      {/* ── 흰 수염 ── */}
      <Path d="M57 130 Q50 150 57 170 Q72 190 100 194 Q128 190 143 170 Q150 150 143 130 Q126 142 100 146 Q74 142 57 130Z"
        fill="url(#sBeard)" />
      <Path d="M64 134 Q57 154 63 172 Q72 185 86 191" stroke="#D0C8A8" strokeWidth="1.5" fill="none" opacity="0.5" />
      <Path d="M100 146 Q98 166 100 190"              stroke="#C0B898" strokeWidth="1.5" fill="none" opacity="0.45" />
      <Path d="M136 134 Q143 154 137 172 Q128 185 114 191" stroke="#787060" strokeWidth="1.2" fill="none" opacity="0.38" />
      <Path d="M130 136 Q138 156 136 174" stroke="#180E06" strokeWidth="2" fill="none" opacity="0.5" />
      {/* 콧수염 */}
      <Path d="M79 128 Q89 121 100 124 Q111 121 121 128 Q110 135 100 132 Q90 135 79 128Z" fill="#A09070" />
      <Path d="M80 127 Q89 120 100 123" stroke="#D0C8A0" strokeWidth="1" fill="none" opacity="0.55" />

      {/* 얼굴 측면 그림자 */}
      <Path d="M54 98 Q51 126 57 148" stroke="#100600" strokeWidth="5" fill="none" opacity="0.7" />
      <Path d="M146 98 Q149 126 143 148" stroke="#080400" strokeWidth="7" fill="none" opacity="0.55" />
      {/* 볼 빛 */}
      <Ellipse cx="65" cy="110" rx="15" ry="11" fill="#FF9030" opacity="0.1" />

      {/* 장식 내부 테두리 */}
      <Circle cx="100" cy="100" r="91" fill="none" stroke="#C88010" strokeWidth="1.5" opacity="0.5" />
      <Circle cx="100" cy="100" r="88" fill="none" stroke="#A06008" strokeWidth="0.7" opacity="0.35" />
    </Svg>
  );
}
