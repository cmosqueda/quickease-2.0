import { X } from "lucide-react";

export default function TermsAndPrivacyPolicyModal() {
  return (
    <dialog
      id="terms-of-use-modal"
      className="modal modal-bottom  sm:modal-middle overflow-scroll bg-base-300"
    >
      <div className="bg-base-100 p-4 lg:p-8 xl:p-12 xl:rounded-3xl h-full w-full xl:max-h-[80vh] overflow-y-scroll xl:w-[50vw] flex flex-col gap-2">
        <article className="">
          <X
          className="absolute bg-base-200 p-1 rounded-xl shadow"
            size={36}
            onClick={() => {
              const modal = document.getElementById(
                "terms-of-use-modal"
              ) as HTMLDialogElement;

              modal.close();
            }}
          />
          <h1 className="text-center text-4xl font-bold mt-16 xl:mt-0">Privacy Policy</h1>
          <div className="text-center text-base-content/70 mb-4 not-prose">
            <p>
              <strong>Effective Date:</strong> September 25, 2025
            </p>
          </div>
          <p>
            This Privacy Policy explains how <strong>QuickEase</strong> (“the
            Application”, “the Service”, “we”, or “our”) collects, uses, and
            protects user information. The Application is developed as part of a{" "}
            <strong>capstone project</strong> by students of University of
            Science and Technology of Southern Philippines and is not intended
            for commercial distribution.
          </p>

          <hr className="my-6 border-base-content/10" />

          <section className="mb-8">
            <h2 className="font-bold text-2xl mb-2">
              1. Information We Collect
            </h2>
            <p>
              We collect only the information necessary for the proper
              functioning of the Application. This may include:
            </p>
            <ul className="list-disc ml-8">
              <li>
                <strong>Personal Information:</strong> such as name, email
                address, and login credentials when creating an account.
              </li>
              <li>
                <strong>Study Materials:</strong> uploaded files (e.g., PDFs or
                text documents) used for AI-powered summarization and quiz
                generation.
              </li>
              <li>
                <strong>Usage Data:</strong> interactions within the
                Application, including quiz results, progress tracking, and
                session history.
              </li>
              <li>
                <strong>Device Information (basic):</strong> non-identifiable
                details such as device type and operating system to ensure
                compatibility.
              </li>
            </ul>
            <p className="font-medium mt-4">
              We do <strong>not</strong> collect sensitive personal information
              such as government IDs, financial data, or precise location.
            </p>
          </section>

          <hr className="my-6 border-base-content/10" />

          <section className="mb-8">
            <h2 className="font-bold text-2xl mb-2">
              2. How We Use Information
            </h2>
            <p>
              The information collected is used{" "}
              <strong>strictly for academic and functional purposes</strong> and
              is not intended for commercial exploitation. Specifically, we use
              data to:
            </p>
            <ul className="list-disc ml-8">
              <li>
                <strong>Generate Study Aids:</strong> Uploaded study materials
                are processed by the AI system to create summaries, quizzes, and
                other learning insights tailored to support the user’s academic
                needs.
              </li>
              <li>
                <strong>Track Learning Progress:</strong> User activity, such as
                completed quizzes and in-app badge rewards, is monitored within
                the app to provide feedback and help students identify areas for
                improvement.
              </li>
              <li>
                <strong>Communicate with Users:</strong> Personal information
                such as email addresses may be used to send essential
                notifications, including policy updates, system alerts, or
                academic feedback related to the app’s use.
              </li>
            </ul>
            <p className="mt-4">
              We will never use personal or academic data for advertising,
              marketing, or unrelated purposes.
            </p>
          </section>

          <hr className="my-6 border-base-content/10" />

          <section className="mb-8">
            <h2 className="font-bold text-2xl mb-2">
              3. Data Storage and Retention
            </h2>
            <p>
              We take careful steps to ensure that user data is managed
              responsibly and used only for the duration of this academic
              project:
            </p>
            <ul className="list-disc ml-8">
              <li>
                <strong>Storage Location:</strong> User data, including personal
                details, uploaded study materials, and quiz results, are secured
                in a PostgreSQL Neon instance cloud-based platform selected for
                project development.
              </li>
              <li>
                <strong>Retention Period:</strong> Uploaded files, generated
                quizzes, and performance records will be retained{" "}
                <strong>only while the project is ongoing</strong> or until a
                user actively chooses to delete their account and associated
                content.
              </li>
              <li>
                <strong>End of Project Handling:</strong> Upon conclusion of the
                capstone project, the Project Team may:
                <ul className="list-[circle] ml-8">
                  <li>
                    Archive certain data in anonymized form for academic
                    reporting and evaluation, or
                  </li>
                  <li>
                    Permanently delete all identifiable user information and
                    uploaded content to protect user privacy.
                  </li>
                </ul>
              </li>
              <li>
                <strong>User Control:</strong> Users may request deletion of
                their personal information and uploaded materials at any time,
                and such requests will be honored promptly.
              </li>
            </ul>
            <p className="mt-4">
              While we implement appropriate measures to safeguard data, users
              should avoid uploading highly confidential or sensitive materials.
            </p>
          </section>

          <hr className="my-6 border-base-content/10" />

          <section className="mb-8">
            <h2 className="font-bold text-2xl mb-2">
              4. Data Sharing and Disclosure
            </h2>
            <p>We respect your privacy and handle data responsibly:</p>
            <ul className="list-disc ml-8">
              <li>
                <strong>No Commercial Use:</strong> User data is never sold,
                rented, or shared with external third parties for advertising,
                marketing, or commercial purposes.
              </li>
              <li>
                <strong>Limited Access:</strong> Only the Project Team and
                designated faculty advisers may access user information, and
                solely for the purpose of academic evaluation, system
                improvement, and capstone project requirements.
              </li>
              <li>
                <strong>Legal or Institutional Compliance:</strong> In rare
                cases, information may be disclosed if required to comply with
                applicable laws, school regulations, or academic integrity
                guidelines.
              </li>
            </ul>
          </section>

          <hr className="my-6 border-base-content/10" />

          <section className="mb-8">
            <h2 className="font-bold text-2xl mb-2">5. AI Services</h2>
            <p>
              The Application integrates{" "}
              <strong>Gemini API (Google’s Generative AI)</strong> to support
              study functions:
            </p>
            <ul className="list-disc ml-8">
              <li>
                <strong>Processing of Content:</strong> Uploaded documents and
                study materials may be transmitted temporarily to the Gemini API
                in order to generate summaries, quizzes, flashcards, and
                insights.
              </li>
              <li>
                <strong>Third-Party Policies:</strong> While we make efforts to
                safeguard information, users should note that Google’s Gemini
                API applies its own{" "}
                <strong>data handling and privacy practices</strong>, which may
                differ from this Privacy Policy.
              </li>
              <li>
                <strong>User Responsibility:</strong> For this reason, we
                strongly encourage users not to upload highly sensitive or
                confidential materials.
              </li>
            </ul>
          </section>

          <hr className="my-6 border-base-content/10" />

          <section className="mb-8">
            <h2 className="font-bold text-2xl mb-2">6. Data Security</h2>
            <p>
              We strive to maintain the confidentiality and integrity of user
              information:
            </p>
            <ul className="list-disc ml-8">
              <li>
                <strong>Protective Measures:</strong> Reasonable technical and
                organizational safeguards (e.g., password protection, secure
                cloud storage) are implemented to reduce risks of unauthorized
                access, alteration, disclosure, or data loss.
              </li>
              <li>
                <strong>Project Limitation:</strong> As this Application is
                developed as a student project,{" "}
                <strong>absolute data security cannot be guaranteed</strong>.
              </li>
              <li>
                <strong>User Precaution:</strong> Users are advised to upload
                only academic-related materials and avoid sensitive or personal
                files.
              </li>
            </ul>
          </section>

          <hr className="my-6 border-base-content/10" />

          <section className="mb-8">
            <h2 className="font-bold text-2xl mb-2">7. Children’s Privacy</h2>
            <p>We are committed to protecting younger users:</p>
            <ul className="list-disc ml-8">
              <li>
                <strong>Intended Audience:</strong> The Application is designed
                primarily for students in higher education and older learners.
              </li>
              <li>
                <strong>Under 15 Use:</strong> Children under the age of 15 may
                only use the Application under the{" "}
                <strong>
                  supervision and consent of a parent, guardian, or teacher
                </strong>
                .
              </li>
              <li>
                <strong>Guardian Responsibility:</strong> Supervising adults are
                responsible for ensuring that children’s data is handled
                appropriately in accordance with this Privacy Policy.
              </li>
            </ul>
          </section>

          <hr className="my-6 border-base-content/10" />

          <section className="mb-8">
            <h2 className="font-bold text-2xl mb-2">8. Your Rights</h2>
            <p>
              As a user, you maintain control over your information and have the
              following rights:
            </p>
            <ul className="list-disc ml-8">
              <li>
                <strong>Access and Update:</strong> You may review, correct, or
                update your personal information through your account settings.
              </li>
              <li>
                <strong>Data Deletion:</strong> You may request deletion of your
                uploaded study materials, quiz results, or entire account at any
                time.
              </li>
              <li>
                <strong>Withdrawal:</strong> You may stop using the Application
                whenever you choose. Account deletion will remove associated
                data, subject to academic reporting requirements.
              </li>
            </ul>
          </section>

          <hr className="my-6 border-base-content/10" />

          <section className="mb-8">
            <h2 className="font-bold text-2xl mb-2">
              9. Changes to this Privacy Policy
            </h2>
            <ul className="list-disc ml-8">
              <li>
                <strong>Policy Updates:</strong> This Privacy Policy may be
                updated as needed to reflect project requirements, academic
                feedback, or system improvements.
              </li>
              <li>
                <strong>User Notification:</strong> Any significant revisions
                will be communicated through the Application to ensure users are
                aware of changes.
              </li>
              <li>
                <strong>Continued Use:</strong> By continuing to use the
                Application after updates, you acknowledge and accept the
                revised terms of this Privacy Policy.
              </li>
            </ul>
          </section>

          <section className="mb-8 p-6 bg-base-200 rounded-lg border border-base-300 not-prose">
            <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
            <p className="mb-4">
              If you have any questions, feedback, or concerns about this
              Privacy Policy, you may reach out to the Project Team using the
              contact details below:
            </p>

            <div className="flex flex-col gap-1">
              <strong className="text-lg">Team Ikinamada</strong>
              <div className="text-base-content/80">
                <span className="font-semibold">Members:</span> Christine
                Mosqueda, Jhon Lloyd Viernes, Sherri Nicole Tilan, Jalanie
                Baraocor, Leann Christian Flores
              </div>
              <div className="text-base-content/80 mt-2 italic">
                Capstone Project Team – University of Science and Technology of
                Southern Philippines
              </div>
              <div className="mt-2">
                <span className="font-semibold">Email: </span>
                <a
                  href="mailto:quickease.mail@gmail.com"
                  className="link link-primary"
                >
                  quickease.mail@gmail.com
                </a>
              </div>
            </div>
          </section>
        </article>
      </div>
    </dialog>
  );
}
