import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Circle, Ellipse, Path, Rect, Defs, RadialGradient, LinearGradient, Stop,
} from 'react-native-svg';
import { PhilosopherId } from '@/constants/philosophers';

interface Props {
  philosopherId: PhilosopherId;
  width: number;
  height: number;
}

// 소크라테스 배경 실루엣 — 납작코, 대머리, 두꺼운 수염
function SocratesBg({ width, height }: { width: number; height: number }) {
  const sx = width / 300;
  const sy = height / 400;
  return (
    <Svg width={width} height={height} viewBox="0 0 300 400" style={StyleSheet.absoluteFill}>
      <Defs>
        <RadialGradient id="sBgGrad" cx="50%" cy="40%" r="55%">
          <Stop offset="0%" stopColor="#E8A030" stopOpacity="0.18" />
          <Stop offset="100%" stopColor="#E8A030" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="sSilhouette" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#D4860A" stopOpacity="0.12" />
          <Stop offset="70%" stopColor="#D4860A" stopOpacity="0.07" />
          <Stop offset="100%" stopColor="#D4860A" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* 배경 글로우 */}
      <Ellipse cx="150" cy="160" rx="140" ry="160" fill="url(#sBgGrad)" />

      {/* 몸 */}
      <Path d="M60 340 Q100 300 150 285 Q200 300 240 340 L260 400 L40 400Z"
        fill="url(#sSilhouette)" />
      {/* 목 */}
      <Path d="M125 280 Q150 272 175 280 L178 300 Q150 308 122 300Z"
        fill="url(#sSilhouette)" />
      {/* 얼굴 */}
      <Ellipse cx="150" cy="188" rx="70" ry="78" fill="url(#sSilhouette)" />
      {/* 대머리 두피 */}
      <Ellipse cx="150" cy="132" rx="65" ry="46" fill="#D4860A" opacity="0.07" />
      {/* 수염 */}
      <Path d="M88 248 Q82 272 90 296 Q110 318 150 325 Q190 318 210 296 Q218 272 212 248 Q186 262 150 265 Q114 262 88 248Z"
        fill="#D4860A" opacity="0.09" />
      {/* 납작 코 강조 */}
      <Ellipse cx="150" cy="220" rx="22" ry="14" fill="#D4860A" opacity="0.1" />

      {/* 월계관 */}
      <Path d="M86 145 Q80 130 86 118 Q94 106 104 114 Q102 104 110 100 Q120 96 126 106 Q128 96 138 94"
        stroke="#60A030" strokeWidth="3" fill="none" opacity="0.15" strokeLinecap="round" />
      <Path d="M214 145 Q220 130 214 118 Q206 106 196 114 Q198 104 190 100 Q180 96 174 106 Q172 96 162 94"
        stroke="#60A030" strokeWidth="3" fill="none" opacity="0.15" strokeLinecap="round" />

      {/* 배경 소크라테스 문양 — 올빼미 */}
      <Circle cx="38" cy="80" r="18" fill="#D4860A" opacity="0.07" />
      <Circle cx="38" cy="80" r="10" fill="none" stroke="#D4860A" strokeWidth="2" opacity="0.12" />
      {/* 배경 텍스트 — 명언 */}
      <Circle cx="262" cy="320" r="24" fill="none" stroke="#D4860A" strokeWidth="1.5" opacity="0.1" />
    </Svg>
  );
}

// 플라톤 배경 실루엣 — 웨이브 머리, 넓은 이마, 풍성한 수염
function PlatoBg({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 300 400" style={StyleSheet.absoluteFill}>
      <Defs>
        <RadialGradient id="pBgGrad" cx="50%" cy="40%" r="55%">
          <Stop offset="0%" stopColor="#4A5CA8" stopOpacity="0.18" />
          <Stop offset="100%" stopColor="#4A5CA8" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="pSilhouette" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#3D4F8E" stopOpacity="0.13" />
          <Stop offset="70%" stopColor="#3D4F8E" stopOpacity="0.07" />
          <Stop offset="100%" stopColor="#3D4F8E" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      <Ellipse cx="150" cy="160" rx="140" ry="160" fill="url(#pBgGrad)" />

      {/* 몸 — 당당한 체구 */}
      <Path d="M50 345 Q95 302 150 286 Q205 302 250 345 L268 400 L32 400Z"
        fill="url(#pSilhouette)" />
      {/* 목 */}
      <Path d="M122 280 Q150 272 178 280 L181 302 Q150 310 119 302Z"
        fill="url(#pSilhouette)" />
      {/* 얼굴 — 넓고 당당한 */}
      <Path d="M82 160 Q80 208 90 238 Q108 268 150 274 Q192 268 210 238 Q220 208 218 160 Q198 138 150 134 Q102 138 82 160Z"
        fill="url(#pSilhouette)" />
      {/* 넓은 이마 강조 */}
      <Ellipse cx="150" cy="142" rx="62" ry="30" fill="#3D4F8E" opacity="0.08" />
      {/* 풍성한 웨이브 머리 */}
      <Path d="M82 160 Q70 130 78 100 Q90 70 118 58 Q78 90 80 130Z" fill="#3D4F8E" opacity="0.09" />
      <Path d="M218 160 Q230 130 222 100 Q210 70 182 58 Q222 90 220 130Z" fill="#3D4F8E" opacity="0.09" />
      <Path d="M90 150 Q88 112 98 88 Q110 66 150 56 Q190 66 202 88 Q212 112 210 150"
        fill="#3D4F8E" opacity="0.08" />
      {/* 수염 */}
      <Path d="M80 248 Q74 272 80 298 Q98 322 150 330 Q202 322 220 298 Q226 272 220 248 Q196 264 150 268 Q104 264 80 248Z"
        fill="#3D4F8E" opacity="0.1" />

      {/* 별 / 이데아 문양 */}
      <Circle cx="36" cy="65" r="5" fill="#4A5CA8" opacity="0.15" />
      <Circle cx="264" cy="72" r="4" fill="#4A5CA8" opacity="0.12" />
      <Circle cx="28" cy="200" r="7" fill="none" stroke="#4A5CA8" strokeWidth="2" opacity="0.12" />
      <Circle cx="272" cy="190" r="5" fill="none" stroke="#4A5CA8" strokeWidth="1.5" opacity="0.1" />
      {/* 기둥 장식 */}
      <Path d="M24 360 L24 300 M20 360 L28 360 M20 300 L28 300" stroke="#4A5CA8" strokeWidth="2" opacity="0.1" />
      <Path d="M276 360 L276 300 M272 360 L280 360 M272 300 L280 300" stroke="#4A5CA8" strokeWidth="2" opacity="0.1" />
    </Svg>
  );
}

// 아리스토텔레스 배경 실루엣 — 날카로운 이목구비, 단정한 머리
function AristotleBg({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 300 400" style={StyleSheet.absoluteFill}>
      <Defs>
        <RadialGradient id="aBgGrad" cx="50%" cy="40%" r="55%">
          <Stop offset="0%" stopColor="#2E8B57" stopOpacity="0.18" />
          <Stop offset="100%" stopColor="#2E8B57" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="aSilhouette" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#2E7D52" stopOpacity="0.13" />
          <Stop offset="70%" stopColor="#2E7D52" stopOpacity="0.07" />
          <Stop offset="100%" stopColor="#2E7D52" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      <Ellipse cx="150" cy="160" rx="140" ry="160" fill="url(#aBgGrad)" />

      {/* 두루마리 장식 (손에 든 것) */}
      <Rect x="210" y="268" width="52" height="32" rx="14" fill="#2E7D52" opacity="0.1" />
      <Rect x="208" y="268" width="14" height="32" rx="7" fill="#2E7D52" opacity="0.09" />
      <Rect x="248" y="268" width="14" height="32" rx="7" fill="#2E7D52" opacity="0.09" />

      {/* 몸 */}
      <Path d="M55 342 Q98 304 150 288 Q202 304 245 342 L262 400 L38 400Z"
        fill="url(#aSilhouette)" />
      {/* 목 */}
      <Path d="M124 282 Q150 274 176 282 L178 302 Q150 310 122 302Z"
        fill="url(#aSilhouette)" />
      {/* 얼굴 — 날카롭고 세련된 */}
      <Ellipse cx="150" cy="190" rx="66" ry="74" fill="url(#aSilhouette)" />
      {/* 단정한 짧은 머리 */}
      <Path d="M86 178 Q84 142 96 116 Q112 90 150 82 Q188 90 204 116 Q216 142 214 178"
        fill="#2E7D52" opacity="0.08" />
      {/* 트리밍 수염 */}
      <Path d="M92 242 Q88 258 92 272 Q104 286 150 292 Q196 286 208 272 Q212 258 208 242 Q190 250 150 253 Q110 250 92 242Z"
        fill="#2E7D52" opacity="0.1" />
      {/* 날카로운 코 */}
      <Path d="M146 188 L143 218 Q150 224 157 218 L154 188Z" fill="#2E7D52" opacity="0.12" />

      {/* 균형의 저울 */}
      <Path d="M30 120 L50 120" stroke="#2E8B57" strokeWidth="3" opacity="0.15" strokeLinecap="round" />
      <Path d="M40 120 L40 140" stroke="#2E8B57" strokeWidth="3" opacity="0.15" />
      <Path d="M24 140 L40 140 L56 140" stroke="#2E8B57" strokeWidth="3" opacity="0.15" strokeLinecap="round" />
      <Circle cx="24" cy="148" r="9" fill="#2E8B57" opacity="0.12" />
      <Circle cx="56" cy="148" r="9" fill="#2E8B57" opacity="0.12" />

      {/* 자연 잎사귀 */}
      <Path d="M256 40 Q268 24 264 10 Q258 24 256 40Z" fill="#40A860" opacity="0.15" />
      <Path d="M262 56 Q278 40 274 26 Q268 40 262 56Z" fill="#38A050" opacity="0.13" />
      <Path d="M38 340 Q26 324 30 310 Q36 324 38 340Z" fill="#40A860" opacity="0.13" />
    </Svg>
  );
}

export default function ChatBackground({ philosopherId, width, height }: Props) {
  if (philosopherId === 'socrates') return <SocratesBg width={width} height={height} />;
  if (philosopherId === 'plato') return <PlatoBg width={width} height={height} />;
  if (philosopherId === 'aristotle') return <AristotleBg width={width} height={height} />;
  return null;
}
