import { Lalezar } from "next/font/google";

// فونت نمایشی فقط برای بخش «امکانات سیستم». عمداً سراسری نیست و فقط
// روی عناصری اعمال می‌شود که className این فونت را دارند.
const displayFont = Lalezar({
  subsets: ["arabic"],
  weight: "400",
  display: "swap",
});

const FEATURES = [
  {
    title: "منوی دیجیتال هوشمند",
    text: "منوی کاغذی رستوران یا کافه‌ی خود را با یک منوی دیجیتال مدرن جایگزین کنید.",
  },
  {
    title: "نمایش حرفه‌ای غذاها و نوشیدنی‌ها",
    text: "تصویر، توضیحات، قیمت، مواد تشکیل‌دهنده، آلرژن‌ها و سطح تندی هر محصول در صفحه‌ی اختصاصی آن.",
  },
  {
    title: "دسته‌بندی منظم",
    text: "غذاها و نوشیدنی‌ها در دسته‌بندی‌های مجزا و با نوار ناوبری سریع برای پیدا کردن آسان.",
  },
  {
    title: "دسترسی با اسکن QR کد",
    text: "برای هر رستوران یک QR کد ساخته می‌شود. مشتری آن را اسکن می‌کند و منو را بدون نصب اپ می‌بیند.",
  },
  {
    title: "پنل مدیریت اختصاصی",
    text: "هر رستوران پنل مخصوص خود را دارد و فقط به اطلاعات خودش دسترسی دارد.",
  },
  {
    title: "مدیریت منو و دسته‌بندی‌ها",
    text: "افزودن، ویرایش و حذف غذاها، تغییر قیمت و موجود یا ناموجود کردن آن‌ها به‌صورت آنی.",
  },
  {
    title: "مدیریت تنظیمات رستوران",
    text: "ویرایش نام، توضیحات و آدرس اختصاصی منوی عمومی رستوران.",
  },
  {
    title: "آمار بازدید و عملکرد منو",
    text: "بازدید روزانه‌ی منو و پربازدیدترین غذاها را ببینید. آمار ناشناس است و اطلاعات شخصی مشتری ذخیره نمی‌شود.",
  },
  {
    title: "سازگار با موبایل",
    text: "طراحی ریسپانسیو، کاملاً فارسی و راست‌به‌چین، سریع و راحت برای لمس با انگشت.",
  },
];

const CUSTOM_SERVICES = [
  {
    title: "منوی دیجیتال اختصاصی",
    text: "ساخت منوی دیجیتال متناسب با نیاز رستوران یا کافه‌ی شما.",
  },
  {
    title: "شخصی‌سازی ظاهر و تم",
    text: "طراحی ظاهر و تم اختصاصی منو برای هماهنگی با برند شما، به‌صورت سفارشی.",
  },
  {
    title: "طراحی سایت شخصی و اختصاصی",
    text: "طراحی و راه‌اندازی وب‌سایت اختصاصی برای کسب‌وکار شما.",
  },
];

const COMING_SOON = [
  {
    title: "دستیار هوشمند منو",
    text: "مشتری بپرسد «گوشت نمی‌خورم، چی پیشنهاد میدی؟» و دستیار از روی منوی واقعی رستوران جواب بدهد.",
  },
];

const CONTACTS = [
  { name: "معظمی", phone: "09371913699" },
  { name: "نظری", phone: "09305165152" },
];

const TELEGRAM_ID = "PaKanDev";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#14213D]">
      {/* نوار بالا */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <span className="text-lg font-bold tracking-tight text-[#0F2747]">
          منوی دیجیتال هوشمند
        </span>
        <nav className="flex items-center gap-2">
          <a
            href="/login"
            className="rounded-xl px-4 py-2 text-sm text-[#3B4963] transition duration-300 hover:bg-[#0F2747]/5 hover:text-[#0F2747] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B]"
          >
            ورود مدیران
          </a>
          <a
            href="#contact"
            className="rounded-xl bg-[#0F2747] px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#C9A24B] hover:text-[#0B1B33] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B] focus-visible:ring-offset-2"
          >
            تماس با ما
          </a>
        </nav>
      </header>

      {/* بخش اصلی */}
      <section className="mx-auto max-w-3xl px-4 py-14 text-center sm:py-20">
        <h1 className="text-3xl font-extrabold leading-snug tracking-tight text-[#0B1B33] sm:text-5xl sm:leading-tight">
          منوی رستوران شما،
          <br />
          فقط با یک اسکن
        </h1>
        <p className="mx-auto mt-5 max-w-xl leading-8 text-[#4A566D]">
          سیستم منوی دیجیتال برای رستوران‌ها و کافه‌ها. مشتری QR کد روی میز را
          اسکن می‌کند و منو را با تصویر، قیمت، مواد تشکیل‌دهنده و آلرژن‌ها
          روی گوشی خود می‌بیند.
        </p>
        <div className="mt-8 flex justify-center">
          <a
            href="#contact"
            className="rounded-xl bg-[#0F2747] px-7 py-3.5 font-medium text-white shadow-md shadow-[#0F2747]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#C9A24B] hover:text-[#0B1B33] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B] focus-visible:ring-offset-2"
          >
            سفارش و دریافت مشاوره
          </a>
        </div>
      </section>

      {/* امکانات */}
      <section className="bg-gradient-to-b from-[#0B1B33] to-[#13294B] px-4 py-14 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h2
            className={`${displayFont.className} mb-10 text-center text-3xl font-normal tracking-normal text-[#E3BF6B] sm:text-4xl`}
          >
            امکانات سیستم
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#C9A24B]/60 hover:bg-white/10 hover:shadow-lg hover:shadow-black/20"
              >
                <h3
                  className={`${displayFont.className} mb-2 text-lg font-normal leading-8 text-white`}
                >
                  {feature.title}
                </h3>
                <p className="text-sm leading-7 text-slate-300">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* خدمات سفارشی */}
      <section className="px-4 py-14 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 text-center text-2xl font-bold tracking-tight text-[#0B1B33]">
            خدمات سفارشی
          </h2>
          <p className="mb-8 text-center text-sm text-[#6B7487]">
            این خدمات با سفارش و هماهنگی قبلی انجام می‌شوند.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {CUSTOM_SERVICES.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#C9A24B] hover:shadow-md"
              >
                <h3 className="mb-2 font-semibold text-[#0F2747]">{service.title}</h3>
                <p className="text-sm leading-7 text-[#4A566D]">{service.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* به‌زودی */}
      <section className="bg-[#F1ECE2] px-4 py-14 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-[#0B1B33]">
            به‌زودی
          </h2>
          <div className="grid gap-4">
            {COMING_SOON.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-dashed border-[#C9A24B]/70 bg-white p-5 shadow-sm transition duration-300 hover:shadow-md"
              >
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="font-semibold text-[#0F2747]">{item.title}</h3>
                  <span className="rounded-full bg-[#C9A24B]/15 px-2.5 py-0.5 text-xs font-medium text-[#8A6A1F]">
                    به‌زودی
                  </span>
                </div>
                <p className="text-sm leading-7 text-[#4A566D]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ارتباط با ما */}
      <section id="contact" className="scroll-mt-4 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[#C9A24B]/30 bg-gradient-to-br from-[#0B1B33] to-[#16305A] p-6 text-center shadow-xl shadow-[#0B1B33]/20 sm:p-10">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-white">
            برای اطلاعات بیشتر و سفارش خدمات
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-sm leading-8 text-slate-300">
            برای دریافت اطلاعات بیشتر درباره ساخت منوی دیجیتال اختصاصی برای
            رستوران و کافه، یا طراحی سایت شخصی و اختصاصی، از طریق راه‌های
            ارتباطی زیر با ما در تماس باشید.
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {CONTACTS.map((contact) => (
              <a
                key={contact.phone}
                href={`tel:${contact.phone}`}
                className="flex flex-col items-center gap-1 rounded-2xl border border-transparent bg-[#FAF7F2] px-4 py-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#C9A24B] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B]"
              >
                <span className="text-sm text-[#6B7487]">{contact.name}</span>
                <span className="text-lg font-semibold text-[#0F2747]" dir="ltr">
                  {contact.phone}
                </span>
                <span className="text-xs text-[#8A6A1F]">تماس تلفنی</span>
              </a>
            ))}

            <a
              href={`https://t.me/${TELEGRAM_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 rounded-2xl border border-transparent bg-[#FAF7F2] px-4 py-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#C9A24B] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B]"
            >
              <span className="text-sm text-[#6B7487]">تلگرام</span>
              <span className="text-lg font-semibold text-[#0F2747]" dir="ltr">
                @{TELEGRAM_ID}
              </span>
              <span className="text-xs text-[#8A6A1F]">ارسال پیام</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#C9A24B]/30 bg-[#0B1B33] px-4 py-6 text-center text-sm text-slate-400">
        منوی دیجیتال هوشمند
      </footer>
    </main>
  );
}