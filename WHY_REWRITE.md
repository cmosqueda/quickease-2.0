# Reasons why I rewrote QuickEase from scratch

---

### 1. Unreadable code

`@/pages/auth/resetPass.jsx`
Here's a example, like what is `img.sadboi`? That's literally unreadable and I wouldn't know that it's the mascot without the `alt`.

```
import { img } from '../../constants';

<div className="w-full md:w-1/2 flex justify-center items-center md:justify-center mb-8 md:mb-0 h-1/2 md:h-full">
<img
    src={img.sadboi}
    alt="Mascot"
    className="w-80 h-80 md:w-full md:h-object-contain"
/>
</div>
```

`@/pages/auth/signIn.jsx`
Here's another example, hard-coded brand name. As of writing this, I've only checked so far the `signIn.jsx` page. They could've extracted this to a idk, maybe logo component? Or just use one image/svg/png?

```
<h1 className="relative font-text-8xl tracking-tight">
    <span className="text-zinc-dark:text-white">QUICK</span>
    <span className="text-dark:text-secondary">EASE</span>
</h1>
```

`@/pages/auth/signUp.jsx`
Here's also another example of their scaling on the same .jsx page. That's so hacky and so brittle, one uncommon screen size and that'll bust out.

```
className="relative w-[130%] h-[130%] transform -translate-y-8"
```

Fixed percentages don't adapt well, so there's the responsiveness side. Below is a fix for the responsiveness.

```
<div className="relative w-full h-full flex items-center justify-center">
  <img
    src={isDarkMode ? img.quick : img.Mascot}
    alt="QuickEase Mascot"
    className="
      max-w-[500px] w-full h-auto object-contain
      transform hover:scale-105 transition-transform duration-700
      animate-float-gentle drop-shadow-2xl
    "
  />
</div>
```

**Benefits**

```
- w-full h-auto → scales naturally with container width, keeping aspect ratio.
- max-w-[500px] → mascot won’t balloon beyond reason. You can tweak size per breakpoint (e.g., lg:max-w-[700px]).
- Still allows hover animation and float animation without layout breakage.
- Works for both light and dark mascots without layout flicker.
```

`@/pages/main/home.jsx`
Here's also another example where they check every input if the user inputs or erases something in the textfield

```
const handleTextChange = (e) => {
		const text = e.target.value;
		setInputText(text);
		setCharacterCount(text.length);
		const words = text.split(/\s+/).filter(Boolean).length;
		setWordCount(words);

		if (text.length === 0) {
			setTextError('Text input cannot be empty.');
		} else if (words < 200) {
			setTextError('Text must be at least 200 words long.');
		} else if (text.length > 10000) {
			setTextError('Text cannot exceed 10000 characters.');
		} else {
			setTextError('');
		}
	};
```

**Problem**: This is repetitive and could get out of sync.
**Fix**: Extract a validateTextInput(text) helper that returns { valid, error }, and use it in both places. Single source of truth.

This Home component is 600+ lines and handles:

- File validation
- File uploads (drag/drop + button)
- Word/character validation
- API calls for summarization
- Joyride onboarding
- Modal error handling
- Sidebar toggle
- Dark mode UI

Like bro, 7 responsibilities in one page? WHAT THE FUCK

`@/pages/main/profile.jsx`
Duplicate components or idk? Their imports are also confusing as to what I've noticed as of writing this.
Inside AchievementsModal, their code redefine a BadgeCard component with memo, but it already imported BadgeCard from `../../components/Cards/badgCard`.

```
import BadgeCard from "../../components/Cards/badgCard";

  const AchievementsModal = ({ isOpen, onClose }) => {
    const achievementsCount = earnedBadgeIds.length;
    const totalBadges = Object.keys(badgeDefinitions).length;

    const BadgeCard = memo(({ badge, isEarned }) => (
      <div className="bg-white dark:bg-zinc-800/50 rounded-2xl p-4">
        <div className="flex flex-col items-center">
          <img
            src={badge.image}
            alt={badge.title}
            className={`w-16 h-16 mb-3 ${
              isEarned ? "opacity-100" : "opacity-50"
            }`}
            style={{ transform: `scale(${isEarned ? 1 : 0.9})` }}
          />

          <h3
            className={`text-base font-pbold text-center mb-2 ${
              isEarned
                ? "text-primary dark:text-secondary"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {badge.title}
          </h3>

          <p className="text-sm text-center text-zinc-600 dark:text-zinc-400 mb-3">
            {badge.description}
          </p>

          <div
            className={`px-4 py-1.5 rounded-full text-xs font-pmedium ${
              isEarned
                ? "bg-primary/10 dark:bg-secondary/20 text-primary dark:text-secondary"
                : "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400"
            }`}
          >
            {isEarned ? "Achieved" : "Not Yet Achieved"}
          </div>
        </div>
      </div>
    ));

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center">
          <div className="bg-zinc-50 dark:bg-zinc-900 w-full sm:w-[800px] max-h-[80vh] rounded-t-[32px] sm:rounded-2xl shadow-lg">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 dark:bg-secondary/20 p-2 rounded-full">
                    <FontAwesomeIcon
                      icon={faMedal}
                      className="text-2xl text-primary "
                    />
                  </div>
                  <h2 className="text-xl font-pbold text-primary dark:text-secondary">
                    Achievements
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="text-lg text-gray-600 dark:text-gray-400"
                  />
                </button>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500 font-pregular dark:text-gray-400 mb-2">
                  Your Progress
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-pbold text-primary dark:text-secondary">
                    {achievementsCount}/{totalBadges}
                  </p>
                  <p className="text-sm text-gray-500 font-pregular dark:text-gray-400">
                    Badges Earned
                  </p>
                </div>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="overflow-y-auto p-4 max-h-[calc(80vh-180px)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(badgeDefinitions).map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    isEarned={earnedBadgeIds.includes(badge.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };
```

I know this is clearly nitpicking, but this screams **technical debt** so much in the codebase by just seeing these. That's why I started with this.

---

### 2. No documentations on their codebase

The original codebase, whether web, mobile, or backend, has little to no documentation. At best, there are fragments, but nothing that gives proper context or makes navigation easy for new developers. This lack of documentation makes onboarding a nightmare and forces devs to constantly reverse-engineer the code just to understand what’s going on. Without comments, README files, or even a clear architectural overview, the project becomes an endless guessing game.

---

### 3. No TypeScript and zero type-safety

The original codebase is written entirely in plain `.jsx`. **PLAIN JSX.** with no type-safety at all. For a project built around 2024, skipping TypeScript is a major setback. TypeScript has become the standard in modern development because it helps prevent runtime errors, enforces clearer contracts between components, and makes collaboration easier. Without it, the IDE can’t properly assist and with features like autocomplete, type inference, and early error detection are basically unusable.

This was the biggest reason I chose to rebuild the project. Working on a **pure .jsx** codebase in 2024 is inefficient and frustrating, especially when adding or scaling features. My rewritten version isn’t perfectly type-safe—it doesn’t catch every single edge case, but it covers roughly 80% of them. That’s a huge improvement compared to the original, which had no type-safety whatsoever.

---

### 4. Codebase incompatible with development environments

The original developers left a note in their repo that says:

`“!! IMPORTANT NOTE !! This is an API, it is meant to be hosted in a DigitalOcean Droplet. Any and all the code run on a local machine will NOT work. Please contact our developers at quickease.team@gmail.com
 for inquiries.”`

This already shows a major problem: their codebase was hard-locked to a single deployment setup (DigitalOcean) with no thought for flexibility. When I actually tried running it locally, it immediately broke because it required environment variables that we had no access to. Without those, the backend simply won’t function. In other words, the project wasn’t just inconvenient to run locally, maybe it was literally impossible.

On top of that, many features depended on APIs we didn’t have credentials for. Even if we wanted to patch things, we’d be stuck. Compare that with our rebuild: we used the Gemini API, which is free, accessible, and works in both local and production environments. This change removed the cost of using OpenAI/ChatGPT’s paid API and made development/testing feasible for everyone on the team. Plus, Gemini is already being adopted widely (it even powers Google Search now), so it’s likely to maintain or have a free tier for developers (even if soon it's limited, but atleast it's still accessible).

The combination of DigitalOcean lock-in, inaccessible environment variables, and unavailable APIs made the old codebase practically unusable.

---

### 5. Why I rewrote the backend and moved from Python (Django) to Node.js + Fastify

The original backend was built in Python with Django, but I decided to rewrite it in Node.js with Fastify. This wasn’t just about preference. It was a practical decision to make the project more maintainable, scalable, and capstone-friendly.

- **Unified language across the stack**
  With Node.js, both the frontend and backend use JavaScript/TypeScript. That reduces mental overhead and makes it easier for developers to contribute across the stack. Instead of switching between two different languages, future teams can just focus on one.

- **Flexibility through plugins**
  Fastify’s plugin ecosystem is modular. You can add exactly what you need without dragging in unnecessary complexity.

- **Familiarity and maintainability**
  Most students and junior devs are already comfortable with JavaScript/Node. If this capstone gets passed down, it will be easier for future teams to maintain and extend. Choosing Django would mean handing them a heavier learning curve.

- **JSON-first by default**
  Since Node is natively JavaScript, working with JSON is seamless. Django can do it too, but it requires serialization layers and ORM gymnastics. For modern frontends like React or Flutter, a JSON-first backend makes life much easier.

- **Deployment and hosting advantages**
  One of the biggest reasons for the switch was deployment. Free-tier platforms overwhelmingly support Node.js out of the box. Vercel, Railway, and Render all make deploying a Node app as simple as pushing to GitHub.

- **Developer experience**
  With Node + Fastify, local development is faster and simpler. Hot reload, lighter configs, TypeScript support, and less boilerplate all mean quicker iteration.

- **If asked “Why not Django?”**
  We chose Node.js with Fastify because deployment is significantly easier and more sustainable for a capstone project. Platforms like Vercel, Railway, and Render all natively support Node with free plans, while Django requires more setup and ongoing maintenance. Node’s event-driven model also scales better and fits into modern serverless ecosystems. In short, Node let us focus on building features instead of wrestling with deployment headaches, while also ensuring future teams can easily continue the project.

  | Aspect                    | **Node.js + Fastify**                                                                               | **Python + Django**                                                                                         |
  | ------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
  | **Free Hosting Support**  | Widely supported: Vercel, Railway, Render, Fly.io, Heroku, Netlify (via functions)                  | Limited: Mostly Render, Railway, Heroku (with more config). Rare on Vercel/Netlify.                         |
  | **Setup Complexity**      | Minimal – push to GitHub, auto-deploy with zero config on most services                             | Higher – requires WSGI server (Gunicorn/uWSGI), static/media handling, and environment configs              |
  | **Database Support**      | Works easily with hosted free DBs (Postgres, MongoDB, Redis) on services like Railway/Neon/Supabase | Also works, but Django ORM usually expects relational DBs; needs extra setup (migrations, storage backends) |
  | **Scaling**               | Event-driven model, easy to scale horizontally; serverless options widely available                 | Possible, but Django isn’t designed for serverless—needs ASGI for async and more resources to scale         |
  | **Community / Ecosystem** | Most free-tier platforms provide Node.js examples and templates by default                          | Fewer Python/Django templates, usually aimed at paid plans                                                  |
  | **Capstone-friendly**     | Fits student projects with free, quick deployments and minimal server management                    | Risk of hitting platform limitations sooner; more maintenance overhead for future teams                     |

---

### 6. Technical debt everywhere

Because of the lack of documentation, structure, and coding standards, their codebase is weighed down by technical debt. It might run, but trying to maintain it or extend its features is unnecessarily painful. That’s one of the main reasons I chose to rewrite it from scratch. My rewrite isn’t flawless or “perfectly clean code,” but it significantly reduces the amount of technical debt compared to what was there before. I focused on clearer structure, more consistent practices, and better organization, so future development will be a lot less frustrating than dealing with the original mess.
