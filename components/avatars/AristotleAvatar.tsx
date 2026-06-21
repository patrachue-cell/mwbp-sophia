import React from 'react';
import Svg, {
  Circle, Ellipse, Path, Rect, Defs, RadialGradient, LinearGradient, Stop,
} from 'react-native-svg';

interface Props { size?: number; }

// 아리스토텔레스 — RPG 전설급 카드풍
// 에메랄드 초록 테두리, 나뭇잎+저울 배경, 날카로운 이목구비
export default function AristotleAvatar({ size = 120 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <RadialGradient id="aBg" cx="50%" cy="40%" r="60%">
          <Stop offset="0%"  stopColor="#061408" />
          <Stop offset="60%" stopColor="#030A04" />
          <Stop offset="100%" stopColor="#010402" />
        </RadialGradient>
        <RadialGradient id="aGlow" cx="35%" cy="22%" r="68%">
          <Stop offset="0%"  stopColor="#70E890" stopOpacity="0.88" />
          <Stop offset="40%" stopColor="#20A840" stopOpacity="0.48" />
          <Stop offset="100%" stopColor="#001808" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="aRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%"   stopColor="#A0F0B8" />
          <Stop offset="25%"  stopColor="#30C058" />
          <Stop offset="50%"  stopColor="#0A5820" />
          <Stop offset="75%"  stopColor="#30C058" />
          <Stop offset="100%" stopColor="#A0F0B8" />
        </LinearGradient>
        <RadialGradient id="aFace" cx="30%" cy="26%" r="70%">
          <Stop offset="0%"  stopColor="#D0A868" />
          <Stop offset="38%" stopColor="#886835" />
          <Stop offset="72%" stopColor="#4A2C0E" />
          <Stop offset="100%" stopColor="#120600" />
        </RadialGradient>
        <LinearGradient id="aHair" x1="25%" y1="0%" x2="85%" y2="100%">
          <Stop offset="0%"  stopColor="#282010" />
          <Stop offset="42%" stopColor="#0E0A04" />
          <Stop offset="100%" stopColor="#030200" />
        </LinearGradient>
        <LinearGradient id="aBeard" x1="28%" y1="0%" x2="85%" y2="100%">
          <Stop offset="0%"  stopColor="#201808" />
          <Stop offset="45%" stopColor="#0A0804" />
          <Stop offset="100%" stopColor="#020100" />
        </LinearGradient>
        <LinearGradient id="aRobe" x1="28%" y1="0%" x2="88%" y2="100%">
          <Stop offset="0%"  stopColor="#1E6030" />
          <Stop offset="42%" stopColor="#0A3018" />
          <Stop offset="100%" stopColor="#020806" />
        </LinearGradient>
        <LinearGradient id="aScroll" x1="28%" y1="0%" x2="85%" y2="100%">
          <Stop offset="0%"  stopColor="#7A6628" />
          <Stop offset="55%" stopColor="#3A2E0E" />
          <Stop offset="100%" stopColor="#100800" />
        </LinearGradient>
        <RadialGradient id="aLeafBg" cx="68%" cy="25%" r="48%">
          <Stop offset="0%"  stopColor="#1A4820" stopOpacity="0.45" />
          <Stop offset="100%" stopColor="#001008" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* 초록 외곽 글로우 */}
      <Circle cx="100" cy="100" r="99" fill="#20A040" opacity="0.45" />
      <Circle cx="100" cy="100" r="97" fill="#80E8A0" opacity="0.18" />
      <Circle cx="100" cy="100" r="96" fill="url(#aRim)" />
      <Circle cx="100" cy="100" r="93" fill="url(#aBg)" />
      <Circle cx="100" cy="100" r="93" fill="url(#aGlow)" />
      <Circle cx="100" cy="100" r="93" fill="url(#aLeafBg)" />

      {/* 나뭇잎 배경 장식 */}
      <Path d="M158 18 Q170 6 166 -2 Q160 10 158 18Z"  fill="#50C868" opacity="0.4" />
      <Path d="M164 30 Q178 16 174 6 Q166 20 164 30Z"  fill="#40B850" opacity="0.35" />
      <Path d="M153 35 Q163 20 158 10 Q152 24 153 35Z" fill="#60D070" opacity="0.3" />
      <Path d="M170 45 Q182 30 178 20 Q172 34 170 45Z" fill="#38A848" opacity="0.28" />
      <Path d="M175 55 Q185 42 182 32 Q176 46 175 55Z" fill="#30A040" opacity="0.25" />
      {/* 코너 */}
      <Circle cx="18"  cy="18"  r="8" fill="none" stroke="#28A040" strokeWidth="1.5" opacity="0.55" />
      <Circle cx="18"  cy="18"  r="4" fill="none" stroke="#40C058" strokeWidth="1"   opacity="0.5"  />
      <Circle cx="182" cy="182" r="8" fill="none" stroke="#28A040" strokeWidth="1.5" opacity="0.4"  />
      {/* 빛 파티클 */}
      <Circle cx="26"  cy="55" r="1.5" fill="#70E080" opacity="0.6"  />
      <Circle cx="18"  cy="88" r="1"   fill="#50C060" opacity="0.55" />
      <Circle cx="174" cy="48" r="1.8" fill="#80F090" opacity="0.6"  />
      <Circle cx="180" cy="80" r="1.2" fill="#60D878" opacity="0.55" />
      <Circle cx="30"  cy="168" r="1.2" fill="#40B850" opacity="0.4" />

      {/* 균형 저울 — 아리스토텔레스 상징 */}
      <Path d="M22 62 L38 62" stroke="#38C050" strokeWidth="2.2" opacity="0.4" strokeLinecap="round" />
      <Path d="M30 62 L30 78" stroke="#38C050" strokeWidth="2.2" opacity="0.4" />
      <Path d="M16 78 L30 78 L44 78" stroke="#38C050" strokeWidth="2.2" opacity="0.4" strokeLinecap="round" />
      <Circle cx="16" cy="85" r="7" fill="#208838" opacity="0.35" />
      <Circle cx="16" cy="85" r="4" fill="#40C058" opacity="0.3"  />
      <Circle cx="44" cy="85" r="7" fill="#208838" opacity="0.35" />
      <Circle cx="44" cy="85" r="4" fill="#40C058" opacity="0.3"  />

      {/* 두루마리 */}
      <Rect x="148" y="148" width="40" height="26" rx="12" fill="url(#aScroll)" />
      <Rect x="146" y="148" width="13" height="26" rx="6.5" fill="#5A4818" opacity="0.85" />
      <Rect x="175" y="148" width="13" height="26" rx="6.5" fill="#4A3810" opacity="0.85" />
      <Path d="M161 154 L179 154" stroke="#907830" strokeWidth="1.2" opacity="0.7" />
      <Path d="M161 159 L179 159" stroke="#907830" strokeWidth="1.2" opacity="0.6" />
      <Path d="M161 164 L176 164" stroke="#907830" strokeWidth="1"   opacity="0.5" />
      <Ellipse cx="156" cy="157" rx="4.5" ry="9" fill="#C0A050" opacity="0.22" />

      {/* 로브 */}
      <Path d="M6 196 Q44 158 100 144 Q156 158 194 196 L200 200 L0 200Z" fill="url(#aRobe)" />
      <Path d="M28 193 Q60 168 100 156" stroke="#28804A" strokeWidth="1.2" fill="none" opacity="0.7" />

      {/* 목 */}
      <Path d="M83 136 Q100 130 117 136 L120 152 Q100 158 80 152Z" fill="#341808" />

      {/* 귀 */}
      <Path d="M55 98 Q48 105 50 116 Q53 124 59 121 Q53 114 56 106Z"  fill="#281206" />
      <Path d="M145 98 Q152 105 150 116 Q147 124 141 121 Q147 114 144 106Z" fill="#1C0C04" />

      {/* 얼굴 */}
      <Path d="M55 98 Q51 126 58 148 Q72 168 100 172 Q128 168 142 148 Q149 126 145 98 Q130 78 100 74 Q70 78 55 98Z"
        fill="url(#aFace)" />

      {/* 단정한 짧은 머리 */}
      <Path d="M55 98 Q52 68 66 46 Q80 24 100 18 Q120 24 134 46 Q148 68 145 98 Q128 82 100 78 Q72 82 55 98Z"
        fill="url(#aHair)" />
      <Path d="M62 84 Q66 58 78 40 Q88 24 100 20"  stroke="#484018" strokeWidth="2.5" fill="none" opacity="0.55" />
      <Path d="M60 68 Q66 48 76 34 Q84 22 94 18"   stroke="#383010" strokeWidth="1.5" fill="none" opacity="0.45" />
      <Path d="M138 84 Q134 58 122 40 Q112 24 100 20" stroke="#383010" strokeWidth="2" fill="none" opacity="0.5"  />
      {/* 이마 경계 */}
      <Path d="M62 84 Q80 76 100 74 Q120 76 138 84" stroke="#180C04" strokeWidth="1" fill="none" opacity="0.7" />

      {/* 눈썹 — 날카로운 아치 */}
      <Path d="M61 88 Q74 80 89 85"   stroke="#1E1208" strokeWidth="4.8" strokeLinecap="round" fill="none" />
      <Path d="M111 85 Q126 80 139 88" stroke="#1E1208" strokeWidth="4.8" strokeLinecap="round" fill="none" />
      <Path d="M62 87 Q74 79 88 84"   stroke="#40C858" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.42" />
      <Path d="M112 84 Q126 79 138 87" stroke="#38B848" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.38" />

      {/* 눈 — 에메랄드 빛반사 */}
      <Ellipse cx="77" cy="98"  rx="14" ry="11" fill="#060E08" />
      <Ellipse cx="123" cy="98" rx="14" ry="11" fill="#040C06" />
      <Circle cx="78"  cy="98" r="9"   fill="#082818" />
      <Circle cx="124" cy="98" r="9"   fill="#061C10" />
      <Circle cx="78"  cy="98" r="6.5" fill="#186838" />
      <Circle cx="124" cy="98" r="6.5" fill="#105428" />
      <Circle cx="78"  cy="98" r="3.5" fill="#020804" />
      <Circle cx="124" cy="98" r="3.5" fill="#010604" />
      <Ellipse cx="72" cy="91" rx="4.5" ry="3"  fill="#70E890" opacity="0.88" />
      <Circle  cx="70" cy="89" r="2"            fill="#FFFFFF"  opacity="0.98" />
      <Ellipse cx="118" cy="92" rx="3.2" ry="2.2" fill="#50D068" opacity="0.68" />
      <Circle  cx="117" cy="91" r="1.2"          fill="#FFFFFF"  opacity="0.85" />
      <Path d="M63 94 Q77 86 91 94"   stroke="#160C04" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d="M109 94 Q123 86 137 94" stroke="#100804" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d="M64 108 Q77 112 91 108"  stroke="#160A04" strokeWidth="1.5" fill="none" opacity="0.6"  />
      <Path d="M109 108 Q122 112 136 108" stroke="#100804" strokeWidth="1.5" fill="none" opacity="0.55" />

      {/* 코 — 날카로운 그리스 코 */}
      <Path d="M96 96 L93 120 Q100 127 107 120 L104 96 Q100 92 96 96Z" fill="#381A08" />
      <Path d="M97 96 Q100 91 103 96" stroke="#608040" strokeWidth="1.5" fill="none" />
      <Ellipse cx="91"  cy="120" rx="8.5" ry="5.5" fill="#241006" />
      <Ellipse cx="109" cy="120" rx="8.5" ry="5.5" fill="#1A0C04" />
      <Ellipse cx="91"  cy="121" rx="4.5" ry="3.2" fill="#0C0602" />
      <Ellipse cx="109" cy="121" rx="4.5" ry="3.2" fill="#080402" />
      <Ellipse cx="99"  cy="107" rx="3"   ry="5.5" fill="#60C870" opacity="0.18" />

      {/* 단정한 수염 */}
      <Path d="M59 132 Q52 152 59 172 Q74 190 100 194 Q126 190 141 172 Q148 152 141 132 Q124 144 100 148 Q76 144 59 132Z"
        fill="url(#aBeard)" />
      <Path d="M66 136 Q59 156 66 174 Q74 188 88 193" stroke="#302818" strokeWidth="1.5" fill="none" opacity="0.5"  />
      <Path d="M100 148 Q98 168 100 190"              stroke="#242010" strokeWidth="1.5" fill="none" opacity="0.45" />
      <Path d="M134 136 Q141 156 134 174 Q126 188 112 193" stroke="#1C1608" strokeWidth="1.2" fill="none" opacity="0.42" />
      <Path d="M68 138 Q61 158 68 176" stroke="#362E18" strokeWidth="1.5" fill="none" opacity="0.42" />
      {/* 수염 경계 */}
      <Path d="M61 132 Q80 124 100 127 Q120 124 139 132" stroke="#181008" strokeWidth="1" fill="none" opacity="0.6" />
      {/* 콧수염 */}
      <Path d="M80 130 Q90 123 100 126 Q110 123 120 130 Q110 137 100 135 Q90 137 80 130Z" fill="#160E06" />
      {/* 미소 */}
      <Path d="M84 142 Q100 149 116 142" stroke="#503010" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* 그림자 */}
      <Path d="M55 98 Q52 126 58 148"  stroke="#020804" strokeWidth="6" fill="none" opacity="0.68" />
      <Path d="M145 98 Q148 126 142 148" stroke="#010602" strokeWidth="8" fill="none" opacity="0.58" />
      <Ellipse cx="65" cy="110" rx="14" ry="10" fill="#30C050" opacity="0.08" />

      <Circle cx="100" cy="100" r="91" fill="none" stroke="#18882E" strokeWidth="1.5" opacity="0.5"  />
      <Circle cx="100" cy="100" r="88" fill="none" stroke="#106020" strokeWidth="0.7" opacity="0.35" />
    </Svg>
  );
}
