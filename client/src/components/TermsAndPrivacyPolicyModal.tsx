export default function TermsAndPrivacyPolicyModal() {
  return (
    <dialog
      id="terms-of-use-modal"
      className="modal modal-bottom sm:modal-middle overflow-scroll"
    >
      <div className="modal-box flex flex-col gap-2">
        <h3 className="font-bold text-3xl text-blue-500">
          Terms and Conditions
        </h3>
        <p className="text-gray-500">
          Welcome to QuickEase! These Terms and Conditions govern your use of
          our web and mobile application. By accessing or using our platform,
          you agree to comply with and be bound by these terms. If you disagree
          with any part of the terms, please do not use our services.
        </p>
        <div>
          <h1 className="font-bold text-gray-800 text-xl">
            1. GENERAL INFORMATION
          </h1>
          <p className="text-gray-500">
            QuickEase is a web and mobile application designed to assist
            students and general users in enhancing their study habits through
            automated text summarization, flashcard, and quiz generation. The
            platform also provides productivity tools that may help the users
            such as a Pomodoro Timer and Badge Achievements.
          </p>
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
