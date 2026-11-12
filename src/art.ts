import type { Avatar } from "./model";

// Original modular portrait art. Lighting is baked into colour-relative gradients,
// so all existing palettes, expressions and saved characters remain editable.
function tone(hex: string, target: string, amount: number) {
  const rgb = (s: string) =>
    [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const a = rgb(hex),
    b = rgb(target);
  return (
    "#" +
    a
      .map((v, i) =>
        Math.round(v + (b[i] - v) * amount)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

export function avatarSvg(
  a: Avatar,
  prefix = "avatar",
  only?: "hair" | "eyes" | "outfit" | "accessory",
): string {
  const id = prefix.replace(/[^a-zA-Z0-9]/g, "") || "avatar";
  const h = a.hairColor,
    skin = a.skin,
    c = a.clothColor;
  const hd = tone(h, "#12121F", 0.62),
    hl = tone(h, "#F2D9CF", 0.28),
    hm = tone(h, "#141421", 0.23);
  const sd = tone(skin, "#7F4442", 0.32),
    sl = tone(skin, "#FFF3DE", 0.27),
    ss = tone(skin, "#8F5651", 0.18);
  const ink = tone(h, "#241B2D", 0.68),
    lip = tone(skin, "#A24F61", 0.48);
  const fill = (name: string) => `url(#${id}${name})`;
  const p = (
    d: string,
    color: string,
    stroke = "none",
    width = 0.8,
    extra = "",
  ) =>
    `<path d="${d}" fill="${color}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  const line = (d: string, color: string, width = 0.7, opacity = 1) =>
    p(d, "none", color, width, `opacity="${opacity}"`);
  const ellipse = (
    x: number,
    y: number,
    rx: number,
    ry: number,
    color: string,
    opacity = 1,
  ) =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${color}" opacity="${opacity}"/>`;
  const facePath =
    "M133 149 C137 109 162 91 200 91 C237 91 263 111 267 149 L266 193 C265 216 255 241 239 255 L216 274 Q200 285 184 274 L161 255 C145 241 135 216 134 193Z";
  const irisLight = tone(a.eyeColor, "#EFF5CD", 0.44);
  const defs = `<defs>
    <linearGradient id="${id}hair" x1=".1" y1="0" x2=".9" y2="1"><stop stop-color="${hd}"/><stop offset=".24" stop-color="${h}"/><stop offset=".48" stop-color="${hl}"/><stop offset=".69" stop-color="${h}"/><stop offset="1" stop-color="${hd}"/></linearGradient>
    <linearGradient id="${id}back" x1="0" y1="0" x2="1" y2=".7"><stop stop-color="${hd}"/><stop offset=".35" stop-color="${h}"/><stop offset=".58" stop-color="${hm}"/><stop offset=".8" stop-color="${h}"/><stop offset="1" stop-color="${hd}"/></linearGradient>
    <radialGradient id="${id}skin" cx=".41" cy=".29" r=".75"><stop stop-color="${sl}"/><stop offset=".5" stop-color="${skin}"/><stop offset=".84" stop-color="${ss}"/><stop offset="1" stop-color="${sd}"/></radialGradient>
    <linearGradient id="${id}neck" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="${sd}"/><stop offset=".46" stop-color="${skin}"/><stop offset="1" stop-color="${sl}"/></linearGradient>
    <linearGradient id="${id}cloth" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="${tone(c, "#FFF8EA", 0.25)}"/><stop offset=".4" stop-color="${c}"/><stop offset=".8" stop-color="${tone(c, "#39364C", 0.25)}"/><stop offset="1" stop-color="${tone(c, "#292337", 0.38)}"/></linearGradient>
    <linearGradient id="${id}ivory" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FFF9EF"/><stop offset=".5" stop-color="#EEE4DA"/><stop offset="1" stop-color="#C9BBC6"/></linearGradient>
    <radialGradient id="${id}iris" cx=".53" cy=".74" r=".75"><stop stop-color="${irisLight}"/><stop offset=".46" stop-color="${a.eyeColor}"/><stop offset="1" stop-color="${tone(a.eyeColor, "#15192B", 0.7)}"/></radialGradient>
    <radialGradient id="${id}sclera" cx=".5" cy=".8" r=".9"><stop stop-color="#FFFCF5"/><stop offset=".65" stop-color="#F0E9E8"/><stop offset="1" stop-color="#B39AA3"/></radialGradient>
    <linearGradient id="${id}nose" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${sd}" stop-opacity="0"/><stop offset=".4" stop-color="${sd}" stop-opacity=".4"/><stop offset=".7" stop-color="${sl}" stop-opacity=".8"/><stop offset="1" stop-color="${skin}" stop-opacity="0"/></linearGradient>
    <radialGradient id="${id}blush"><stop stop-color="#D27B80" stop-opacity=".28"/><stop offset="1" stop-color="#D27B80" stop-opacity="0"/></radialGradient>
    <radialGradient id="${id}shadow"><stop stop-color="${sd}" stop-opacity=".44"/><stop offset="1" stop-color="${sd}" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}lip" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${tone(lip, "#703044", 0.2)}"/><stop offset=".55" stop-color="${lip}"/><stop offset="1" stop-color="${tone(lip, "#F8B5AC", 0.45)}"/></linearGradient>
    <linearGradient id="${id}gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#F9E5A7"/><stop offset=".4" stop-color="#D1AC65"/><stop offset=".6" stop-color="#FFF0BE"/><stop offset="1" stop-color="#AF844C"/></linearGradient>
    <clipPath id="${id}faceClip">${p(facePath, "white")}</clipPath>
  </defs>`;
  const bg = a.transparent
    ? ""
    : `<rect width="400" height="400" fill="${a.background}"/><circle cx="172" cy="168" r="155" fill="#FFF8F1" opacity=".28"/>${ellipse(202, 393, 153, 18, "#8F7A9F", 0.15)}`;
  const backShapes = [
    "M116 196 C88 151 100 91 143 69 C191 43 250 61 278 99 C298 126 298 163 282 195 L285 263 Q247 289 204 280 Q156 290 111 264Z",
    "M113 190 C91 136 103 91 142 69 C192 41 254 60 280 105 C302 147 283 190 292 232 Q288 280 301 348 Q260 367 246 351 Q211 365 182 352 Q146 367 104 347 Q119 294 107 246Z",
    "M120 113 C94 88 62 107 67 146 C66 197 54 227 67 270 Q81 300 71 326 Q105 307 105 264 C104 224 130 205 130 157Z M280 113 C306 88 338 107 333 146 C334 197 346 227 333 270 Q319 300 329 326 Q295 307 295 264 C296 224 270 205 270 157Z M116 193 C89 137 111 85 154 67 C205 44 263 76 282 118 Q299 158 279 214 L263 258 L132 258Z",
    "M116 196 L103 173 Q97 143 108 122 L101 122 Q121 80 147 78 Q181 45 224 66 Q263 63 283 106 L291 113 L280 131 Q297 172 278 202 L255 236 L143 236Z",
    "M116 183 C90 132 107 84 148 65 C196 43 254 62 281 108 Q300 149 281 189 Q301 218 286 246 Q310 273 290 301 Q305 329 275 351 Q277 326 259 331 Q254 356 233 350 Q206 365 181 348 Q155 368 139 348 Q115 363 103 341 Q123 319 106 295 Q89 272 108 250 Q89 220 112 200Z",
    "M120 93 C93 48 64 78 80 114 Q87 132 111 129Z M280 93 C307 48 336 78 320 114 Q313 132 289 129Z M117 192 C98 138 112 87 156 70 C202 52 254 74 278 115 Q296 153 281 202 L266 252 L135 252Z",
  ];
  const backHair = p(backShapes[a.hair], fill("back"), hd, 0.9);
  const neck =
    p(
      "M179 260 C183 279 181 290 169 300 L141 313 Q200 358 259 313 L231 300 C219 290 217 279 221 260Z",
      fill("neck"),
      sd,
      0.6,
    ) +
    p(
      "M179 271 Q200 290 221 271 Q215 285 223 297 Q197 313 177 294Z",
      sd,
      "none",
      0,
      'opacity=".24"',
    ) +
    line("M174 306 Q163 311 156 320 M226 306 Q237 311 244 320", sl, 1.2, 0.7);
  const baseShirt = p(
    "M170 299 Q199 319 230 299 L272 317 C306 329 327 362 336 410 L64 410 C73 362 94 329 128 317Z",
    fill("cloth"),
    tone(c, "#2F293A", 0.4),
    0.7,
  );
  const seams =
    line(
      "M115 335 Q103 365 102 400 M284 335 Q297 365 298 400 M133 369 Q130 389 137 405 M267 369 Q272 392 265 405",
      tone(c, "#2D2940", 0.3),
      1,
      0.5,
    ) +
    line(
      "M120 338 Q111 358 110 372 M279 339 Q288 357 290 373",
      tone(c, "#FFF4E5", 0.42),
      2.5,
      0.5,
    );
  const outfits = [
    baseShirt +
      p(
        "M170 299 L150 312 L176 344 L199 320 L224 344 L250 312 L230 299 Q201 316 170 299Z",
        fill("ivory"),
        "#A99AA8",
        0.6,
      ) +
      p("M199 321 L205 410 L194 410Z", tone(c, "#45364E", 0.22)) +
      line("M163 309 L178 335 M237 309 L223 335", "#FFFDF3", 0.9) +
      [352, 377, 401]
        .map((y) => ellipse(208, y, 2.4, 2.8, fill("gold")))
        .join("") +
      seams,
    baseShirt +
      p(
        "M151 306 L126 318 L174 363 L200 339 L226 363 L274 318 L249 306 L200 331Z",
        fill("ivory"),
        "#B8A4B4",
        0.7,
      ) +
      line(
        "M140 318 L175 350 L200 330 L225 350 L260 318",
        tone(c, "#53415F", 0.25),
        2,
      ) +
      p(
        "M200 341 C180 331 177 332 180 355 L199 349 L221 358 Q227 333 200 341Z",
        "#A96D84",
        "#7E4B69",
        0.7,
      ) +
      ellipse(200, 346, 4, 5, "#D9B7B8") +
      seams,
    p(
      "M162 299 Q127 292 113 324 Q78 345 64 410 L336 410 Q322 345 287 324 Q273 292 238 299 Q200 318 162 299Z",
      fill("cloth"),
      tone(c, "#33263F", 0.4),
      0.8,
    ) +
      p(
        "M162 301 Q200 325 238 301 L253 325 Q235 350 201 336 Q165 350 147 325Z",
        tone(c, "#262335", 0.2),
        tone(c, "#45354B", 0.3),
        0.6,
      ) +
      line("M172 331 L170 367 M228 331 L230 367", "#E6DDD8", 1.5) +
      ellipse(170, 367, 1.5, 3, "#D5C9C8") +
      ellipse(230, 367, 1.5, 3, "#D5C9C8") +
      line(
        "M150 388 Q200 378 250 388 M150 389 L145 407 M250 389 L255 407",
        tone(c, "#282336", 0.25),
        0.9,
      ) +
      seams,
    baseShirt +
      p(
        "M170 299 Q200 326 230 299 L237 308 Q200 339 163 308Z",
        tone(c, "#373043", 0.18),
        "none",
      ) +
      line("M170 307 Q200 332 230 307", tone(c, "#FFFAEF", 0.25), 1) +
      seams,
    baseShirt +
      p(
        "M170 299 L153 312 L176 337 L200 320 L224 337 L247 312 L230 299 Q200 316 170 299Z",
        fill("ivory"),
        "#B5A3AD",
        0.6,
      ) +
      p(
        "M199 333 Q164 310 166 349 Q181 355 200 340 Q219 356 234 349 Q237 310 199 333Z",
        tone(c, "#673650", 0.4),
        "#77536D",
        0.6,
      ) +
      p(
        "M193 337 L186 369 L200 362 L215 373 L207 337Z",
        tone(c, "#5C344B", 0.35),
      ) +
      ellipse(200, 337, 5, 6, fill("gold")) +
      seams,
    baseShirt +
      p(
        "M176 293 Q200 305 224 293 L233 316 Q200 338 167 316Z",
        fill("cloth"),
        tone(c, "#30283F", 0.3),
        0.7,
      ) +
      Array.from({ length: 9 }, (_, i) =>
        line(
          `M${177 + i * 5.5} ${301 + Math.sin((i / 8) * Math.PI) * 7} l-1 17`,
          tone(c, "#FFF4E2", 0.3),
          0.6,
          0.6,
        ),
      ).join("") +
      seams,
  ][a.outfit];
  const ears =
    p(
      "M136 180 C119 166 122 197 130 208 Q137 218 141 208Z",
      fill("skin"),
      sd,
      0.7,
    ) +
    p(
      "M264 180 C281 166 278 197 270 208 Q263 218 259 208Z",
      fill("skin"),
      sd,
      0.7,
    ) +
    line(
      "M131 184 Q136 178 136 195 Q128 189 134 202 M269 184 Q264 178 264 195 Q272 189 266 202",
      sd,
      0.8,
      0.7,
    );
  const face =
    p(facePath, fill("skin"), tone(skin, "#74515A", 0.35), 0.65) +
    `<g clip-path="url(#${id}faceClip)">` +
    p(
      "M128 131 Q187 88 268 129 L268 162 Q229 129 198 126 Q163 126 131 166Z",
      hd,
      "none",
      0,
      'opacity=".10"',
    ) +
    ellipse(138, 190, 17, 65, fill("shadow")) +
    ellipse(264, 202, 19, 61, fill("shadow")) +
    ellipse(182, 260, 16, 9, fill("shadow"), 0.5) +
    ellipse(216, 260, 16, 9, fill("shadow"), 0.5) +
    p("M193 184 Q201 181 207 188 L211 226 Q204 236 193 227Z", fill("nose")) +
    (a.blush
      ? ellipse(155, 222, 26, 16, fill("blush")) +
        ellipse(245, 222, 26, 16, fill("blush"))
      : "") +
    `</g>`;

  function eye(x: number, flip = false) {
    const closed = a.eyes === 2 || (a.eyes === 3 && flip);
    const eyePath = "M-22 0 C-12 -11 5 -12 20 -2 Q11 11 -1 11 Q-13 11 -22 0Z";
    const eid = `${id}eye${flip ? "R" : "L"}`;
    const opening = closed
      ? line("M-21 2 Q-1 -10 20 1", ink, 1.7) +
        line("M-19 1 L-23 -2 M-14 -2 L-17 -6", ink, 0.8)
      : `<defs><clipPath id="${eid}">${p(eyePath, "white")}</clipPath></defs>` +
        p(eyePath, fill("sclera")) +
        `<g clip-path="url(#${eid})">${ellipse(0, 1, 8.4, 11.4, fill("iris"))}${ellipse(0, 0, 3.7, 7.4, ink)}${ellipse(0, 7.2, 5.8, 2.5, irisLight, 0.4)}` +
        Array.from({ length: 13 }, (_, i) => {
          const t = (i / 12) * Math.PI;
          return line(
            `M${Math.cos(t) * 5.7} ${Math.sin(t) * 8.2 + 1} l${Math.cos(t) * 1.4} ${Math.sin(t) * 1.9}`,
            irisLight,
            0.38,
            0.65,
          );
        }).join("") +
        ellipse(-2.6, -4.7, 2.5, 2.1, "#FFFFFF", 0.95) +
        ellipse(3.3, 5.8, 1, 1.4, "#FFFBE8", 0.9) +
        p(
          "M-24 -12 L24 -12 L24 0 Q0 -7 -24 2Z",
          ink,
          "none",
          0,
          'opacity=".15"',
        ) +
        `</g>` +
        line(
          a.eyes === 1
            ? "M-25 -7 L-20 -1 Q-3 -15 20 -2 L23 -5"
            : "M-25 -5 L-20 -1 Q-3 -15 20 -2",
          ink,
          1.8,
        ) +
        line("M-22 -2 L-26 -7 M-17 -5 L-20 -10", ink, 0.8) +
        line("M-20 1 Q-8 12 5 11", tone(skin, "#784A53", 0.45), 0.65, 0.8) +
        ellipse(-20, 1, 1.6, 1.5, tone(skin, "#C9757D", 0.4));
    const brow =
      line("M-21 -22 Q-5 -28 16 -22", h, 1.6, 0.85) +
      Array.from({ length: 12 }, (_, i) =>
        line(
          `M${-19 + i * 2.8} ${-22 - Math.sin((i / 12) * Math.PI) * 3} l2 -1.6`,
          hd,
          0.35,
          0.7,
        ),
      ).join("");
    return `<g transform="translate(${x} 187) ${flip ? "scale(-1 1)" : ""}">${line("M-20 -9 Q-3 -19 19 -8", sd, 0.65, 0.55)}${brow}${opening}</g>`;
  }
  const eyes = eye(166) + eye(234, true);
  const nose =
    line("M196 206 Q194 218 191 223 Q194 227 198 226", sd, 0.7, 0.65) +
    line("M203 226 Q207 229 210 224", sd, 0.7, 0.6) +
    ellipse(194, 225, 1.4, 0.65, tone(sd, "#58343C", 0.25), 0.65) +
    ellipse(207, 225, 1.25, 0.6, tone(sd, "#58343C", 0.25), 0.55) +
    line("M198 205 L198 218", sl, 1.2, 0.75) +
    ellipse(201, 223, 3, 1.4, sl, 0.7) +
    line("M199 231 L198 237", sd, 0.45, 0.45);
  const mouths = [
    p(
      "M187 244 Q194 240 199 242 Q203 240 212 244 Q203 253 199 251 Q192 251 187 244Z",
      fill("lip"),
      "none",
    ) +
      line("M187 244 Q199 247 212 244", tone(lip, "#50283F", 0.4), 0.65, 0.85) +
      line("M195 248 Q201 250 206 247", tone(lip, "#FFE2CE", 0.7), 1, 0.55),
    p(
      "M185 243 Q198 247 214 242 Q210 258 200 258 Q191 257 185 243Z",
      tone(lip, "#482435", 0.5),
    ) +
      p("M188 244 Q200 248 211 244 L208 248 Q199 251 191 248Z", "#F6E9DF") +
      p(
        "M193 254 Q200 249 208 254 Q201 259 193 254Z",
        tone(lip, "#F2A09D", 0.5),
      ) +
      line("M186 242 Q198 244 212 241", lip, 0.7),
    p(
      "M188 246 Q196 241 200 243 Q204 241 212 246 Q205 253 200 251 Q193 253 188 246Z",
      fill("lip"),
    ) +
      line("M190 246 Q200 245 210 246", tone(lip, "#512338", 0.4), 0.6) +
      ellipse(201, 249, 5, 0.8, tone(lip, "#F8CEC3", 0.6), 0.6),
    ellipse(200, 247, 5.2, 7, fill("lip")) +
      ellipse(200, 246, 2.7, 4.5, tone(lip, "#4F2735", 0.55)) +
      line("M199 252 Q201 253 203 251", tone(lip, "#FCD6CA", 0.6), 0.7, 0.7),
  ][a.mouth];
  const chin = ellipse(200, 263, 10, 4, sl, 0.32);
  const frontShapes = [
    "M117 184 C102 141 112 103 145 80 Q191 49 239 79 Q285 103 283 157 L277 208 Q273 235 261 251 L258 150 Q231 137 214 100 Q204 126 180 143 L183 120 Q163 143 141 151 L141 239 Q124 225 119 204Z",
    "M118 183 C100 137 115 98 148 77 Q197 50 243 83 Q283 109 281 160 L273 232 Q273 274 287 302 Q261 295 257 265 L259 147 Q230 133 215 99 Q202 132 174 146 L182 117 Q161 144 141 154 L141 252 Q132 284 117 299 Q128 257 119 224Z",
    "M119 182 Q102 125 145 83 Q194 52 240 79 Q284 101 282 160 L272 220 L259 243 L260 150 Q230 139 216 104 Q206 128 183 143 L184 122 Q163 147 141 151 L139 237 L123 217Z",
    "M119 188 L106 162 L115 139 L107 140 Q127 99 153 96 L146 84 Q188 61 225 79 Q263 76 282 115 L271 113 Q287 151 277 186 L264 211 L259 150 Q228 140 216 110 Q204 137 182 148 L186 125 Q164 146 142 155 L135 209Z",
    "M118 186 C100 139 111 101 145 78 Q193 50 238 78 Q284 105 283 157 L272 220 Q259 239 267 258 Q255 254 255 235 L260 149 Q230 134 214 99 Q202 130 175 146 L181 120 Q162 144 141 154 L141 224 Q154 249 136 266 Q143 243 128 226Z",
    "M119 182 Q103 130 145 91 Q194 60 238 88 Q282 109 281 160 L271 216 L260 236 L259 150 Q231 135 215 104 Q204 132 180 147 L183 124 Q163 147 141 155 L138 232 L123 213Z",
  ];
  const frontHair = p(frontShapes[a.hair], fill("hair"), hd, 0.8);
  const crownDetail = Array.from({ length: 25 }, (_, i) => {
    const t = i / 24;
    const x = 121 + t * 158;
    const top = 106 - Math.sin(t * Math.PI) * 38;
    const endX = x < 200 ? x - 8 : x + 6;
    const endY =
      x < 180 ? 151 - (x - 121) * 0.12 : x > 220 ? 151 - (279 - x) * 0.1 : 118;
    return line(
      `M${x} ${top} Q${x - 5} ${top + 19} ${endX} ${endY}`,
      i % 3 === 0 ? hl : hd,
      i % 4 === 0 ? 0.7 : 0.35,
      i % 3 === 0 ? 0.34 : 0.38,
    );
  }).join("");
  const crownSheen =
    p(
      "M125 122 Q149 83 185 80 Q165 93 139 128Z",
      hl,
      "none",
      0,
      'opacity=".20"',
    ) +
    p(
      "M229 86 Q267 105 272 137 L267 139 Q254 110 229 90Z",
      tone(h, "#FFE9CF", 0.6),
      "none",
      0,
      'opacity=".15"',
    ) +
    line("M127 117 Q147 88 171 83", tone(h, "#FFEDE3", 0.55), 1.5, 0.22);
  const sideStrands = [
    "M121 177 Q118 225 126 253 M127 180 Q126 223 134 246 M278 170 Q279 219 267 248 M273 183 Q274 218 268 235",
    "M120 186 Q131 241 117 321 M125 207 Q137 270 125 341 M279 185 Q271 246 286 329 M274 210 Q265 276 277 345 M142 280 Q141 326 153 346 M259 274 Q257 326 246 346",
    "M86 126 Q75 168 83 211 Q94 250 81 294 M91 134 Q86 172 92 211 Q104 248 89 282 M314 126 Q325 168 317 211 Q306 250 319 294 M309 134 Q314 172 308 211 Q296 248 311 282",
    "M119 144 Q113 174 125 196 M125 153 Q122 180 131 199 M278 145 Q284 174 270 196",
    "M116 208 Q107 229 122 248 Q139 269 120 291 Q111 310 124 334 M126 215 Q119 234 135 250 Q147 270 132 293 Q124 315 139 340 M282 210 Q294 228 278 249 Q264 270 282 294 Q292 314 277 337 M273 216 Q280 234 266 252 Q253 272 269 295 Q278 315 262 343",
    "M89 85 Q75 99 98 117 M94 78 Q77 92 99 107 M311 85 Q325 99 302 117 M306 78 Q323 92 301 107 M125 177 Q124 205 131 220 M276 177 Q276 205 269 220",
  ][a.hair];
  const strands =
    line(sideStrands, hl, 1, 0.34) + line(sideStrands, hd, 0.35, 0.5);
  const star = (x: number, y: number, r: number) =>
    p(
      `M${x} ${y - r} l${r * 0.29} ${r * 0.59} ${r * 0.66} ${r * 0.1} -${r * 0.48} ${r * 0.47} ${r * 0.11} ${r * 0.65} -${r * 0.58} -${r * 0.31} -${r * 0.58} ${r * 0.31} ${r * 0.11} -${r * 0.65} -${r * 0.48} -${r * 0.47} ${r * 0.66} -${r * 0.1}Z`,
      fill("gold"),
      "#A88755",
      0.4,
    );
  const accessories = [
    "",
    star(264, 143, 8) +
      star(271, 162, 5.5) +
      line("M257 142 L265 148", "#FFF7CE", 0.6),
    `<g stroke="#6B5A68" stroke-width="1.1" fill="#F5F4F3" fill-opacity=".06"><ellipse cx="166" cy="187" rx="26" ry="20"/><ellipse cx="234" cy="187" rx="26" ry="20"/><path d="M192 184 Q200 180 208 184 M140 182 L129 178 M260 182 L271 178" fill="none"/></g>` +
      line("M148 175 L157 170 M217 175 L225 170", "#FFFCF6", 1, 0.65),
    p("M119 113 Q98 54 113 57 Q137 66 155 91Z", fill("hair"), hd, 0.7) +
      p("M281 113 Q302 54 287 57 Q263 66 245 91Z", fill("hair"), hd, 0.7) +
      p("M122 96 L113 68 L141 91Z", tone(skin, "#BB8C96", 0.38)) +
      p("M278 96 L287 68 L259 91Z", tone(skin, "#BB8C96", 0.38)) +
      line("M113 58 L111 73 M287 58 L289 73", hl, 0.7, 0.6),
    ellipse(132, 207, 2, 2, fill("gold")) +
      ellipse(268, 207, 2, 2, fill("gold")) +
      line("M132 209 L132 224 M268 209 L268 224", "#C7A36B", 0.8) +
      p("M136 223 A8 8 0 1 0 137 239 A6 6 0 0 1 136 223Z", fill("gold")) +
      p("M272 223 A8 8 0 1 0 273 239 A6 6 0 0 1 272 223Z", fill("gold")),
    line("M131 111 Q200 74 269 111", "#7B9F85", 2) +
      [139, 168, 200, 232, 261]
        .map((x, i) => {
          const y = 105 - Math.sin((i / 4) * Math.PI) * 16;
          return (
            Array.from(
              { length: 5 },
              (_, j) =>
                `<ellipse cx="${x}" cy="${y - 5}" rx="3.8" ry="6.6" transform="rotate(${j * 72} ${x} ${y})" fill="${i % 2 ? "#E5B7C5" : "#F6E8D8"}" stroke="#BD8FA1" stroke-width=".3"/>`,
            ).join("") + ellipse(x, y, 2.6, 2.6, fill("gold"))
          );
        })
        .join(""),
  ][a.accessory];
  const decoration = a.transparent
    ? ""
    : ellipse(325, 130, 2.2, 2.2, "#FFFFFF", 0.7) +
      ellipse(80, 252, 1.8, 1.8, "#FFFFFF", 0.65);
  const content =
    only === "hair"
      ? backHair + ears + face + frontHair + crownDetail + crownSheen + strands
      : only === "eyes"
        ? face + eyes + nose + mouths
        : only === "outfit"
          ? neck + outfits
          : backHair +
            neck +
            outfits +
            ears +
            face +
            eyes +
            nose +
            mouths +
            chin +
            frontHair +
            crownDetail +
            crownSheen +
            strands +
            accessories;
  const box =
    only === "outfit"
      ? "70 286 260 114"
      : only === "eyes"
        ? "130 150 140 115"
        : "40 25 320 320";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="${box}">${defs}${bg}${decoration}${content}</svg>`;
}
