import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  useWindowDimensions,
  Image,
} from "react-native";
import Svg, {
  Circle,
  Line,
  Text as SvgText,
  Path,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  G,
} from "react-native-svg";
import Slider from "@react-native-community/slider";

const SCALE = 1.021;

function useLayout() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const hPad = isMobile ? 16 : 40;
  const gap = isMobile ? 0 : 20;
  const usable = width - hPad * 2;
  const cardW = isMobile
    ? Math.min(usable, 440)
    : Math.min((usable - gap) / 2, 500);
  const gaugeSize = Math.min(cardW - 32, isMobile ? 300 : 340);
  return { isMobile, hPad, gap, cardW, gaugeSize };
}

function degToRad(deg: number): number {
  return (deg - 90) * (Math.PI / 180);
}
function polarX(cx: number, cy: number, r: number, deg: number): number {
  return cx + r * Math.cos(degToRad(deg));
}
function polarY(cx: number, cy: number, r: number, deg: number): number {
  return cy + r * Math.sin(degToRad(deg));
}
function arc(cx: number, cy: number, r: number, s: number, e: number, sweep = 1): string {
  const x1 = polarX(cx, cy, r, s);
  const y1 = polarY(cx, cy, r, s);
  const x2 = polarX(cx, cy, r, e);
  const y2 = polarY(cx, cy, r, e);
  const large = Math.abs(e - s) > 180 ? 1 : 0;
  return `M${x1},${y1} A${r},${r} 0 ${large} ${sweep} ${x2},${y2}`;
}

interface RingProps {
  cx: number; cy: number; outerR: number;
  min: number; max: number; color: string;
  bigStep: number; labelStep: number; fontSize: number;
  startDeg?: number; endDeg?: number;
}
interface RingConfig {
  outerR: number; min: number; max: number; color: string;
  bigStep: number; labelStep: number; fs: number;
}
interface GaugeProps {
  value: number; min: number; max: number; isBlue: boolean; size: number;
}
interface CardProps {
  fromF: boolean; cardW: number; gaugeSize: number;
}

function ScaleRing({
  cx, cy, outerR, min, max, color,
  bigStep, labelStep, fontSize,
  startDeg = -135, endDeg = 135,
}: RingProps) {
  const innerR = outerR - 14;
  const elements: React.ReactElement[] = [];
  const totalSteps = Math.round((max - min) / (bigStep / 5));

  for (let i = 0; i <= totalSteps; i++) {
    const val = min + (i / totalSteps) * (max - min);
    const deg = startDeg + (i / totalSteps) * (endDeg - startDeg);
    const isBig = Math.round(val * 100) % Math.round(bigStep * 100) < 1;
    const isLabel = Math.round(val * 100) % Math.round(labelStep * 100) < 1;
    const t1 = outerR + 0.5;
    const t2 = isBig ? outerR - 8 : outerR - 4.5;

    elements.push(
      <Line
        key={`t${i}`}
        x1={polarX(cx, cy, t1, deg)} y1={polarY(cx, cy, t1, deg)}
        x2={polarX(cx, cy, t2, deg)} y2={polarY(cx, cy, t2, deg)}
        stroke={isBig ? "#000000" : "rgba(0,0,0,0.45)"}
        strokeWidth={isBig ? 1.4 : 0.65}
      />
    );

    if (isLabel && isBig) {
      const lr = outerR - 10.5;
      const lx = polarX(cx, cy, lr, deg);
      const ly = polarY(cx, cy, lr, deg);
      const fs = fontSize * SCALE;
      elements.push(
        <G key={`l${i}`} transform={`translate(${lx},${ly}) rotate(${deg})`}>
          <SvgText
            x={0} y={0} fontSize={fs} fontWeight="700"
            fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth={2.5}
            textAnchor="middle" alignmentBaseline="middle"
          >
            {String(Math.round(val))}
          </SvgText>
          <SvgText
            x={0} y={0} fontSize={fs} fontWeight="700"
            fill="#000000" textAnchor="middle" alignmentBaseline="middle"
          >
            {String(Math.round(val))}
          </SvgText>
        </G>
      );
    }
  }

  return (
    <G>
      <Path
        d={`${arc(cx, cy, outerR, startDeg, endDeg)} ${arc(cx, cy, innerR, endDeg, startDeg, 0)} Z`}
        fill={color + "28"}
      />
      <Path d={arc(cx, cy, outerR, startDeg, endDeg)}
        stroke={color + "cc"} strokeWidth={1.2} fill="none" strokeLinecap="round" />
      <Path d={arc(cx, cy, innerR, startDeg, endDeg)}
        stroke={color + "66"} strokeWidth={0.6} fill="none" />
      {elements}
    </G>
  );
}

function ManifoldGauge3D({ value, min, max, isBlue, size }: GaugeProps) {
  const cx = size / 2;
  const cy = size / 2;
  const gearR = size / 2 - 2;
  const bezelR = gearR - 7;
  const faceR = bezelR - 5;
  const innerDiscR = faceR - 64;
  const gearMid  = isBlue ? "#0055ee" : "#ee0000";
  const gearDark = isBlue ? "#001f99" : "#880000";

  const scaleRings: RingConfig[] = isBlue
    ? [
        { outerR: faceR-2,  min:0,   max:160,  color:"#0044dd", bigStep:20,  labelStep:20,  fs:7.5 },
        { outerR: faceR-18, min:0,   max:1100, color:"#0077cc", bigStep:100, labelStep:200, fs:6.5 },
        { outerR: faceR-34, min:0,   max:11,   color:"#005599", bigStep:1,   labelStep:2,   fs:6.0 },
        { outerR: faceR-50, min:-40, max:20,   color:"#cc2200", bigStep:10,  labelStep:10,  fs:5.8 },
      ]
    : [
        { outerR: faceR-2,  min:0,  max:500,  color:"#dd0000", bigStep:50,  labelStep:50,  fs:7.5 },
        { outerR: faceR-18, min:0,  max:3500, color:"#bb2200", bigStep:500, labelStep:500, fs:6.5 },
        { outerR: faceR-34, min:0,  max:35,   color:"#992200", bigStep:5,   labelStep:5,   fs:6.0 },
        { outerR: faceR-50, min:20, max:80,   color:"#0044cc", bigStep:10,  labelStep:10,  fs:5.8 },
      ];

  const units = ["PSI", "kPa", "bar", "°C"];

  const pct = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const needleDeg = -135 + pct * 270;
  const needleLen = innerDiscR + faceR * 0.29;
  const nx = polarX(cx, cy, needleLen, needleDeg);
  const ny = polarY(cx, cy, needleLen, needleDeg);
  const bx = polarX(cx, cy, 15, needleDeg + 180);
  const by = polarY(cx, cy, 15, needleDeg + 180);

  const teeth = 56;
  const gearTeeth: React.ReactElement[] = [];
  for (let i = 0; i < teeth; i++) {
    const a1 = -135 + (i / teeth) * 360;
    const a2 = -135 + ((i + 0.5) / teeth) * 360;
    const a3 = -135 + ((i + 1) / teeth) * 360;
    const r1 = gearR - 9;
    const r2 = gearR + 4;
    const d =
      `M${polarX(cx,cy,r1,a1)},${polarY(cx,cy,r1,a1)} ` +
      `L${polarX(cx,cy,r2,a2)},${polarY(cx,cy,r2,a2)} ` +
      `L${polarX(cx,cy,r1,a3)},${polarY(cx,cy,r1,a3)} Z`;
    gearTeeth.push(
      <Path key={`g${i}`} d={d} fill={gearMid} stroke={gearDark} strokeWidth={0.35} />
    );
  }

  const gid = isBlue ? "B" : "R";

  return (
    <Svg width={size} height={size}>
      <Defs>
        <RadialGradient id={`face${gid}`} cx="38%" cy="38%" r="62%">
          <Stop offset="0%"   stopColor="#fafaff" />
          <Stop offset="55%"  stopColor="#eeedf0" />
          <Stop offset="100%" stopColor="#dddcde" />
        </RadialGradient>
        <RadialGradient id={`disc${gid}`} cx="35%" cy="35%" r="65%">
          <Stop offset="0%"   stopColor="#f8f8f6" />
          <Stop offset="100%" stopColor="#e4e2e0" />
        </RadialGradient>
        <RadialGradient id={`cap${gid}`} cx="30%" cy="30%" r="70%">
          <Stop offset="0%"   stopColor="#eeeeee" />
          <Stop offset="50%"  stopColor="#aaaaaa" />
          <Stop offset="100%" stopColor="#444444" />
        </RadialGradient>
        <RadialGradient id={`glare${gid}`} cx="30%" cy="25%" r="55%">
          <Stop offset="0%"   stopColor="rgba(255,255,255,0.32)" />
          <Stop offset="38%"  stopColor="rgba(255,255,255,0.09)" />
          <Stop offset="100%" stopColor="rgba(255,255,255,0)"    />
        </RadialGradient>
        <LinearGradient id={`bezel${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%"   stopColor="#777" />
          <Stop offset="28%"  stopColor="#ddd" />
          <Stop offset="50%"  stopColor="#fff" />
          <Stop offset="72%"  stopColor="#ccc" />
          <Stop offset="100%" stopColor="#666" />
        </LinearGradient>
      </Defs>

      {gearTeeth}
      <Circle cx={cx} cy={cy} r={gearR-9}   fill={gearMid} />
      <Circle cx={cx} cy={cy} r={bezelR}     fill="none" stroke={`url(#bezel${gid})`} strokeWidth={8} />
      <Circle cx={cx} cy={cy} r={bezelR-4}   fill="none" stroke={`url(#bezel${gid})`} strokeWidth={3} />
      <Circle cx={cx} cy={cy} r={faceR}      fill={`url(#face${gid})`} />
      <Circle cx={cx} cy={cy} r={faceR}      fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth={0.8} />

      {scaleRings.map((r, i) => (
        <ScaleRing
          key={i} cx={cx} cy={cy}
          outerR={r.outerR} min={r.min} max={r.max}
          color={r.color} bigStep={r.bigStep}
          labelStep={r.labelStep} fontSize={r.fs}
        />
      ))}

      {scaleRings.map((r, i) => (
        <SvgText
          key={`u${i}`}
          x={polarX(cx, cy, r.outerR-6, 125)}
          y={polarY(cx, cy, r.outerR-6, 125)}
          fontSize={5.8} fontWeight="700" fill={r.color}
          textAnchor="middle" alignmentBaseline="middle"
        >
          {units[i]}
        </SvgText>
      ))}

      <Circle cx={cx} cy={cy} r={innerDiscR} fill={`url(#disc${gid})`} />
      <Circle cx={cx} cy={cy} r={innerDiscR} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={0.8} />

      <Line x1={cx+1.5} y1={cy+1.5} x2={nx+1.5} y2={ny+1.5}
        stroke="rgba(0,0,0,0.22)" strokeWidth={3.5} strokeLinecap="round" />
      <Line x1={bx} y1={by} x2={nx} y2={ny}
        stroke="#ee1100" strokeWidth={2.8} strokeLinecap="round" />
      <Line x1={cx} y1={cy} x2={bx} y2={by}
        stroke="#990000" strokeWidth={4.5} strokeLinecap="round" />
      <Circle cx={cx} cy={cy} r={10} fill={`url(#cap${gid})`} />
      <Circle cx={cx} cy={cy} r={4}  fill="#ffffff" />
      <Circle cx={cx} cy={cy} r={faceR} fill={`url(#glare${gid})`} />
    </Svg>
  );
}

function ConversionCard({ fromF, cardW, gaugeSize }: CardProps) {
  const isBlue = !fromF;
  const min = -40;
  const max = fromF ? 220 : 100;
  const accent = fromF ? "#ee0000" : "#0055ee";
  const fromUnit = fromF ? "°F" : "°C";
  const toUnit   = fromF ? "°C" : "°F";
  const heading  = fromF ? "Fahrenheit → Celsius" : "Celsius → Fahrenheit";
  const btnLabel = fromF ? "CONVERTER PARA °C" : "CONVERTER PARA °F";

  const [rawVal,    setRawVal]    = useState(fromF ? "72" : "22");
  const [sliderVal, setSliderVal] = useState(fromF ? 72 : 22);
  const [result,    setResult]    = useState<string | null>(fromF ? "22.22" : "71.60");

  const MONO = Platform.OS === "ios" ? "Courier New" : "monospace";

  function onSlider(v: number) {
    const r = Math.round(v * 2) / 2;
    setSliderVal(r); setRawVal(String(r)); setResult(null);
  }
  function onText(t: string) {
    setRawVal(t);
    const v = parseFloat(t);
    if (!isNaN(v)) setSliderVal(Math.min(max, Math.max(min, v)));
    setResult(null);
  }
  function convert() {
    const v = parseFloat(rawVal);
    if (isNaN(v)) return;
    setResult(fromF
      ? ((v - 32) * (5 / 9)).toFixed(2)
      : (v * (9 / 5) + 32).toFixed(2)
    );
  }

  return (
    <View style={[s.card, { width: cardW, borderColor: accent + "55" }]}>
      <Text style={[s.heading, { color: accent }]}>{heading}</Text>

      <View style={{ alignItems: "center", marginBottom: 4 }}>
        <ManifoldGauge3D
          value={sliderVal} min={min} max={max}
          isBlue={isBlue} size={gaugeSize}
        />
      </View>

      <View style={[s.div, { backgroundColor: accent + "35" }]} />

      <View style={s.row}>
        <TextInput
          style={[s.input, {
            borderColor: accent + "70",
            fontFamily: MONO,
            width: Math.max(90, cardW * 0.3),
          }]}
          keyboardType="numeric"
          value={rawVal}
          onChangeText={onText}
          returnKeyType="done"
          onSubmitEditing={convert}
          placeholderTextColor="#bbb"
        />
        <Text style={s.unit}>{fromUnit}</Text>
      </View>

      <View style={s.sliderRow}>
        <Slider
          style={{ flex: 1, height: 36 }}
          minimumValue={min}
          maximumValue={max}
          step={0.5}
          value={sliderVal}
          onValueChange={onSlider}
          minimumTrackTintColor={accent}
          maximumTrackTintColor="rgba(160,160,160,0.25)"
          thumbTintColor={accent}
        />
        <Text style={[s.sliderNum, { fontFamily: MONO }]}>{sliderVal}</Text>
      </View>

      <TouchableOpacity
        style={[s.btn, { backgroundColor: accent }]}
        onPress={convert}
        activeOpacity={0.8}
      >
        <Text style={s.btnTxt}>{btnLabel}</Text>
      </TouchableOpacity>

      {result !== null && (
        <View style={[s.result, { backgroundColor: accent + "14" }]}>
          <Text style={s.resEq}>{rawVal}{fromUnit} = </Text>
          <Text style={[s.resNum, { color: accent, fontFamily: MONO }]}>{result}</Text>
          <Text style={s.resUnit}>{toUnit}</Text>
        </View>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const { isMobile, hPad, gap, cardW, gaugeSize } = useLayout();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F2F1ED" }}
      contentContainerStyle={{
        alignItems: "center",
        paddingHorizontal: hPad,
        paddingTop: Platform.OS === "ios" ? 56 : 28,
        paddingBottom: 32,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={require("../../assets/logo.png")}
        style={s.logo}
        resizeMode="contain"
      />
      <Text style={s.title}>CONVERSOR DE ESCALAS CELSIUS VS FAHRENHEIT</Text>
      <View style={{
        flexDirection: isMobile ? "column" : "row",
        gap: gap,
        alignSelf: "center",
        width: isMobile ? cardW : cardW * 2 + gap,
      }}>
        <ConversionCard fromF={true}  cardW={cardW} gaugeSize={gaugeSize} />
        <ConversionCard fromF={false} cardW={cardW} gaugeSize={gaugeSize} />
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 14,
  },
  title: {
    fontSize: 11, fontWeight: "800", letterSpacing: 4,
    color: "#999", textAlign: "center", marginBottom: 20,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#fff", borderRadius: 20, borderWidth: 0.5,
    padding: 18, marginBottom: 0, shadowColor: "#000",
    shadowOpacity: 0.08, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  heading: {
    fontSize: 11, fontWeight: "800", letterSpacing: 1.8,
    textTransform: "uppercase", marginBottom: 8,
  },
  div:       { height: 0.5, marginVertical: 12 },
  row:       { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  input: {
    fontSize: 20, fontWeight: "500", color: "#1a1a1a",
    borderWidth: 0.5, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: "#FAFAF8",
  },
  unit:      { fontSize: 15, color: "#888", fontWeight: "500" },
  sliderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  sliderNum: { fontSize: 14, color: "#333", minWidth: 48, textAlign: "right", fontWeight: "600" },
  btn:       { borderRadius: 9, paddingVertical: 13, alignItems: "center" },
  btnTxt:    { color: "#fff", fontSize: 12, fontWeight: "800", letterSpacing: 1.2 },
  result: {
    flexDirection: "row", alignItems: "baseline", gap: 4,
    marginTop: 12, borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  resEq:   { fontSize: 13, color: "#888" },
  resNum:  { fontSize: 24, fontWeight: "600" },
  resUnit: { fontSize: 14, color: "#888" },
});