import React from 'react';
import Svg, {
  Circle, Ellipse, Path, Rect, Defs, RadialGradient, LinearGradient, Stop,
} from 'react-native-svg';

interface Props { size?: number; }

// Sophia — RPG 전설급 대여신 카드풍
// 보라/은빛 테두리, 우주 배경, 왕관, 은하 눈동자, 코스믹 날개
export default function SophiaAvatar({ size = 120 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <RadialGradient id="vBg" cx="50%" cy="38%" r="62%">
          <Stop offset="0%"  stopColor="#100820" />
          <Stop offset="55%" stopColor="#060410" />
          <Stop offset="100%" stopColor="#020108" />
        </RadialGradient>
        <RadialGradient id="vGlow" cx="38%" cy="20%" r="70%">
          <Stop offset="0%"  stopColor="#D080FF" stopOpacity="0.92" />
          <Stop offset="38%" stopColor="#8040D0" stopOpacity="0.52" />
          <Stop offset="100%" stopColor="#100028" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="vRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%"   stopColor="#F0E0FF" />
          <Stop offset="22%"  stopColor="#C080FF" />
          <Stop offset="50%"  stopColor="#5010A0" />
          <Stop offset="78%"  stopColor="#C080FF" />
          <Stop offset="100%" stopColor="#F0E0FF" />
        </LinearGradient>
        <RadialGradient id="vFace" cx="32%" cy="28%" r="68%">
          <Stop offset="0%"  stopColor="#F0D8F8" />
          <Stop offset="35%" stopColor="#C098D8" />
          <Stop offset="68%" stopColor="#7040A0" />
          <Stop offset="100%" stopColor="#1A0830" />
        </RadialGradient>
        <LinearGradient id="vHair" x1="22%" y1="0%" x2="85%" y2="100%">
          <Stop offset="0%"  stopColor="#8040C0" />
          <Stop offset="38%" stopColor="#401880" />
          <Stop offset="75%" stopColor="#180830" />
          <Stop offset="100%" stopColor="#060010" />
        </LinearGradient>
        <LinearGradient id="vRobe" x1="28%" y1="0%" x2="88%" y2="100%">
          <Stop offset="0%"  stopColor="#6030B0" />
          <Stop offset="42%" stopColor="#301870" />
          <Stop offset="100%" stopColor="#080418" />
        </LinearGradient>
        <RadialGradient id="vCosmicBg" cx="60%" cy="30%" r="55%">
          <Stop offset="0%"  stopColor="#3010A0" stopOpacity="0.5" />
          <Stop offset="100%" stopColor="#000010" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="vOrb" cx="35%" cy="30%" r="65%">
          <Stop offset="0%"  stopColor="#A060FF" />
          <Stop offset="45%" stopColor="#5010C0" />
          <Stop offset="100%" stopColor="#100040" />
        </RadialGradient>
      </Defs>

      {/* 보라 외곽 글로우 */}
      <Circle cx="100" cy="100" r="99" fill="#8020C0" opacity="0.45" />
      <Circle cx="100" cy="100" r="97" fill="#D0A0FF" opacity="0.22" />
      <Circle cx="100" cy="100" r="96" fill="url(#vRim)" />
      <Circle cx="100" cy="100" r="93" fill="url(#vBg)" />
      <Circle cx="100" cy="100" r="93" fill="url(#vGlow)" />
      <Circle cx="100" cy="100" r="93" fill="url(#vCosmicBg)" />

      {/* 우주 배경 별 */}
      <Circle cx="158" cy="18"  r="2.5" fill="#FFFFFF" opacity="0.9"  />
      <Circle cx="172" cy="32"  r="1.5" fill="#E0C0FF" opacity="0.8"  />
      <Circle cx="164" cy="44"  r="1"   fill="#FFFFFF" opacity="0.7"  />
      <Circle cx="180" cy="52"  r="1.2" fill="#C0A0FF" opacity="0.65" />
      <Circle cx="175" cy="68"  r="0.8" fill="#FFFFFF" opacity="0.6"  />
      <Circle cx="22"  cy="28"  r="1.8" fill="#FFFFFF" opacity="0.65" />
      <Circle cx="16"  cy="50"  r="1.2" fill="#D0B0FF" opacity="0.6"  />
      <Circle cx="28"  cy="65"  r="0.9" fill="#FFFFFF" opacity="0.55" />
      <Circle cx="18"  cy="120" r="1"   fill="#C0A0FF" opacity="0.5"  />
      <Circle cx="182" cy="110" r="1.2" fill="#FFFFFF" opacity="0.45" />
      <Circle cx="22"  cy="168" r="1"   fill="#A080E0" opacity="0.45" />
      <Circle cx="178" cy="162" r="1"   fill="#FFFFFF" opacity="0.4"  />
      {/* 성운 글로우 */}
      <Ellipse cx="165" cy="32" rx="18" ry="12" fill="#5020B0" opacity="0.25" />
      <Ellipse cx="26"  cy="44" rx="14" ry="9"  fill="#4018A0" opacity="0.2"  />

      {/* 코너 별 장식 */}
      <Path d="M18 15 L20 10 L22 15 L27 17 L22 19 L20 24 L18 19 L13 17Z"
        fill="#E0C0FF" opacity="0.6" />
      <Path d="M182 15 L184 10 L186 15 L191 17 L186 19 L184 24 L182 19 L177 17Z"
        fill="#E0C0FF" opacity="0.55" />

      {/* 코스믹 날개 — 반투명 */}
      <Path d="M22 95 Q6 72 8 95 Q10 115 22 110 Q14 105 18 97Z"
        fill="#8030C0" opacity="0.35" />
      <Path d="M22 95 Q8 80 10 95 Q12 108 22 106"
        stroke="#C080FF" strokeWidth="1.2" fill="none" opacity="0.5" />
      <Path d="M178 95 Q194 72 192 95 Q190 115 178 110 Q186 105 182 97Z"
        fill="#8030C0" opacity="0.35" />
      <Path d="M178 95 Q192 80 190 95 Q188 108 178 106"
        stroke="#C080FF" strokeWidth="1.2" fill="none" opacity="0.5" />

      {/* 로브 */}
      <Path d="M6 196 Q44 156 100 142 Q156 156 194 196 L200 200 L0 200Z" fill="url(#vRobe)" />
      <Path d="M28 192 Q60 166 100 156" stroke="#9050D8" strokeWidth="1.2" fill="none" opacity="0.7" />
      {/* 로브 별 문양 */}
      <Circle cx="56"  cy="172" r="1.5" fill="#E0B0FF" opacity="0.5" />
      <Circle cx="100" cy="168" r="2"   fill="#F0C8FF" opacity="0.55" />
      <Circle cx="144" cy="172" r="1.5" fill="#E0B0FF" opacity="0.5"  />
      <Path d="M56 172 L100 168 L144 172" stroke="#C080FF" strokeWidth="0.8" fill="none" opacity="0.35" />

      {/* 목 */}
      <Path d="M82 132 Q100 126 118 132 L121 148 Q100 155 79 148Z" fill="#5820A0" />

      {/* 귀 + 귀걸이 */}
      <Path d="M54 98 Q47 105 49 116 Q52 124 58 121 Q52 114 55 106Z" fill="#3A1870" />
      <Circle cx="50" cy="124" r="4"   fill="#8040D0" />
      <Circle cx="50" cy="124" r="2.5" fill="#C080FF" />
      <Path d="M50 128 L50 134" stroke="#C080FF" strokeWidth="1.2" />
      <Circle cx="50" cy="136" r="2.5" fill="#E0A0FF" />
      <Path d="M146 98 Q153 105 151 116 Q148 124 142 121 Q148 114 145 106Z" fill="#280E60" />
      <Circle cx="150" cy="124" r="4"   fill="#8040D0" />
      <Circle cx="150" cy="124" r="2.5" fill="#C080FF" />
      <Path d="M150 128 L150 134" stroke="#C080FF" strokeWidth="1.2" />
      <Circle cx="150" cy="136" r="2.5" fill="#E0A0FF" />

      {/* 얼굴 */}
      <Path d="M54 98 Q51 126 57 148 Q71 168 100 172 Q129 168 143 148 Q149 126 146 98 Q130 78 100 74 Q70 78 54 98Z"
        fill="url(#vFace)" />

      {/* 왕관 */}
      <Path d="M62 78 L66 60 L72 74 L78 52 L86 68 L100 44 L114 68 L122 52 L128 74 L134 60 L138 78"
        stroke="#E0C0FF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* 왕관 보석 */}
      <Circle cx="100" cy="46" r="6"   fill="#C040FF" />
      <Circle cx="100" cy="46" r="4"   fill="#E080FF" />
      <Circle cx="100" cy="46" r="1.8" fill="#FFFFFF" opacity="0.9" />
      <Circle cx="78"  cy="54" r="4"   fill="#8020D0" />
      <Circle cx="78"  cy="54" r="2.5" fill="#C060FF" />
      <Circle cx="122" cy="54" r="4"   fill="#6010C0" />
      <Circle cx="122" cy="54" r="2.5" fill="#A040E8" />
      <Circle cx="66"  cy="62" r="3"   fill="#FF80E0" />
      <Circle cx="134" cy="62" r="3"   fill="#FF60C8" />
      {/* 왕관 글로우 */}
      <Path d="M64 78 L68 62 L74 76 L80 54 L88 70 L100 46"
        stroke="#F0D0FF" strokeWidth="0.8" fill="none" opacity="0.5" strokeLinecap="round" />

      {/* 머리카락 — 흘러내리는 보라 */}
      <Path d="M54 98 Q44 76 52 52 Q62 28 80 20 Q58 38 56 66 Q54 82 56 96Z"
        fill="url(#vHair)" />
      <Path d="M146 98 Q156 76 148 52 Q138 28 120 20 Q142 38 144 66 Q146 82 144 96Z"
        fill="url(#vHair)" />
      <Path d="M56 96 Q62 68 74 48 Q86 26 100 20 Q114 26 126 48 Q138 68 144 96"
        fill="url(#vHair)" />
      {/* 머리카락 하이라이트 */}
      <Path d="M62 84 Q68 58 78 40 Q88 24 100 20"  stroke="#C070F0" strokeWidth="2.5" fill="none" opacity="0.5"  />
      <Path d="M60 68 Q66 48 76 34 Q84 22 94 20"   stroke="#A050D8" strokeWidth="1.5" fill="none" opacity="0.42" />
      <Path d="M138 84 Q132 58 122 40 Q112 24 100 20" stroke="#9040C8" strokeWidth="2" fill="none" opacity="0.45" />

      {/* 눈썹 — 우아한 아치 */}
      <Path d="M62 88 Q74 80 88 86"   stroke="#3A1870" strokeWidth="4"   strokeLinecap="round" fill="none" />
      <Path d="M112 86 Q126 80 138 88" stroke="#3A1870" strokeWidth="4"   strokeLinecap="round" fill="none" />
      <Path d="M63 87 Q74 79 87 85"   stroke="#D090FF" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"  />
      <Path d="M113 85 Q126 79 137 87" stroke="#C080F0" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.45" />

      {/* 눈 — 은하 눈동자 */}
      <Ellipse cx="77" cy="98"  rx="14" ry="12" fill="#080418" />
      <Ellipse cx="123" cy="98" rx="14" ry="12" fill="#060310" />
      <Circle cx="78"  cy="98" r="9.5" fill="#180850" />
      <Circle cx="124" cy="98" r="9.5" fill="#120640" />
      <Circle cx="78"  cy="98" r="7"   fill="#4010A0" />
      <Circle cx="124" cy="98" r="7"   fill="#300880" />
      <Circle cx="78"  cy="98" r="4.5" fill="#6020C0" />
      <Circle cx="124" cy="98" r="4.5" fill="#5018A0" />
      <Circle cx="78"  cy="98" r="2.5" fill="#080220" />
      <Circle cx="124" cy="98" r="2.5" fill="#060118" />
      {/* 은하 빛반사 */}
      <Ellipse cx="72" cy="91" rx="5"   ry="3.2" fill="#D080FF" opacity="0.92" />
      <Circle  cx="70" cy="89" r="2.2"           fill="#FFFFFF"  opacity="0.98" />
      <Circle  cx="74" cy="92" r="1"             fill="#FFD0FF"  opacity="0.7"  />
      <Ellipse cx="118" cy="92" rx="3.5" ry="2.2" fill="#B060E8" opacity="0.72" />
      <Circle  cx="117" cy="91" r="1.5"           fill="#FFFFFF"  opacity="0.88" />
      {/* 눈꺼풀 + 속눈썹 */}
      <Path d="M63 93 Q77 85 91 93"   stroke="#200848" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <Path d="M109 93 Q123 85 137 93" stroke="#180640" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <Path d="M65 87 Q68 83 70 86"   stroke="#9040D0" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <Path d="M70 85 Q72 81 74 84"   stroke="#9040D0" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <Path d="M130 87 Q132 83 130 86" stroke="#7030B0" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <Path d="M126 85 Q128 81 126 84" stroke="#7030B0" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* 코 — 우아하고 섬세한 */}
      <Path d="M97 95 L95 118 Q100 124 105 118 L103 95 Q100 91 97 95Z" fill="#4C1890" />
      <Path d="M98 95 Q100 91 102 95" stroke="#8050C0" strokeWidth="1.2" fill="none" />
      <Ellipse cx="93"  cy="118" rx="7.5" ry="5" fill="#301268" />
      <Ellipse cx="107" cy="118" rx="7.5" ry="5" fill="#240E58" />
      <Ellipse cx="93"  cy="119" rx="3.8" ry="3" fill="#100430" />
      <Ellipse cx="107" cy="119" rx="3.8" ry="3" fill="#0C0328" />

      {/* 입술 — 보라빛 */}
      <Path d="M82 130 Q90 127 100 129 Q110 127 118 130 Q110 138 100 136 Q90 138 82 130Z"
        fill="#8030A0" />
      <Path d="M83 130 Q90 126 100 128 Q110 126 117 130" stroke="#C060D0" strokeWidth="1" fill="none" />
      <Ellipse cx="100" cy="130" rx="10" ry="2" fill="#C060D8" opacity="0.4" />

      {/* 코스믹 오브 (손에 든 우주 구슬) */}
      <Circle cx="100" cy="155" r="12"  fill="url(#vOrb)" />
      <Circle cx="100" cy="155" r="10"  fill="#3010A0" opacity="0.7" />
      <Circle cx="96"  cy="151" r="6"   fill="#6030D0" opacity="0.5" />
      <Circle cx="98"  cy="153" r="3"   fill="#9060FF" opacity="0.4" />
      <Circle cx="97"  cy="151" r="2"   fill="#FFFFFF"  opacity="0.25" />
      <Circle cx="102" cy="157" r="1.5" fill="#FFD0FF"  opacity="0.4"  />
      <Circle cx="105" cy="152" r="1"   fill="#FFFFFF"  opacity="0.3"  />
      <Circle cx="95"  cy="158" r="0.8" fill="#C0A0FF"  opacity="0.5"  />

      {/* 얼굴 그림자 */}
      <Path d="M54 98 Q51 126 57 148"  stroke="#080220" strokeWidth="5" fill="none" opacity="0.65" />
      <Path d="M146 98 Q149 126 143 148" stroke="#060118" strokeWidth="7" fill="none" opacity="0.55" />
      <Ellipse cx="65" cy="110" rx="14" ry="10" fill="#8030C0" opacity="0.1" />

      <Circle cx="100" cy="100" r="91" fill="none" stroke="#7020C0" strokeWidth="1.5" opacity="0.55" />
      <Circle cx="100" cy="100" r="88" fill="none" stroke="#5010A0" strokeWidth="0.7" opacity="0.38" />
    </Svg>
  );
}
