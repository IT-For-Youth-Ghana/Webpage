export function emojiToIconImage(emoji?: string | null): string | undefined {
  switch (emoji) {
    case "📣": return "/images/icons/megaphone.svg";
    case "💻": return "/images/icons/laptop.svg";
    case "🤝": return "/images/icons/handshake.svg";
    case "🚀": return "/images/icons/rocket.svg";
    case "🧭": return "/images/icons/compass.svg";
    case "📊": return "/images/icons/chart.svg";
    case "✅": return "/images/icons/check.svg";
    case "🏫": return "/images/icons/school.svg";
    case "🛠️": return "/images/icons/wrench.svg";
    case "🔍": return "/images/icons/magnify.svg";
    case "🎯": return "/images/icons/target.svg";
    case "🎤": return "/images/icons/mic.svg";
    case "🗺️": return "/images/icons/map.svg";
    case "🔗": return "/images/icons/link.svg";
    case "📋": return "/images/icons/clipboard.svg";
    case "👥": return "/images/icons/users.svg";
    case "📈": return "/images/icons/arrow-up.svg";
    case "🧩": return "/images/icons/puzzle.svg";
    case "🌍": return "/images/icons/globe.svg";
    case "🎓": return "/images/icons/graduation-cap.svg";
    case "📘": return "/images/icons/book.svg";
    // Variants/gendered/skin tone might not match exactly; normalize common alt forms
    case "🧑‍🏫": return "/images/icons/book.svg";
    case "👩‍💻": return "/images/icons/laptop.svg";
    case "🧪": return "/images/icons/experiment.svg"; // placeholder fallback if added later
    case "🧰": return "/images/icons/wrench.svg";
    case "📢": return "/images/icons/megaphone-outline.svg";
    default:
      return undefined;
  }
}
