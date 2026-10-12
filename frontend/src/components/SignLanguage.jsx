import hello from "../assets/signs/hello.png";
import next from "../assets/signs/next.png";

const signs = {
  hello,
  next,
};

export default function SignLanguage({ sign }) {
  if (!sign || !signs[sign]) return null;

  return (
    <div className="mt-6 flex flex-col items-center bg-slate-800 rounded-2xl p-4 shadow-lg">
      <img
        src={signs[sign]}
        alt={sign}
        className="w-48 h-48 object-contain"
      />

      <p className="text-white text-lg font-bold mt-3 capitalize">
        {sign}
      </p>
    </div>
  );
}