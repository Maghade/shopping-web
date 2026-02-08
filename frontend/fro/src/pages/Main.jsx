export default function Main() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-20 space-y-6 px-4">
      <a href="https://colorlib.com/wp/templates/">
        <img
          src="https://colorlib.com/wp/wp-content/uploads/sites/2/colorlib-push-logo.png"
          alt="Colorlib logo"
          className="mx-auto mt-12"
        />
      </a>

      <h1 className="text-2xl font-bold">Thank you for using our template!</h1>

      <p className="text-lg">
        For more awesome templates please visit{" "}
        <strong>
          <a
            href="https://colorlib.com/wp/templates/"
            className="text-blue-600 hover:underline"
          >
            Colorlib
          </a>
        </strong>.
      </p>

      <p className="text-red-600 font-semibold max-w-2xl">
        Copyright information for the template can't be altered/removed unless
        you purchase a license.
      </p>

      <p className="font-semibold max-w-2xl">
        Removing copyright information without the license will result in
        suspension of your hosting and/or domain name(s).
      </p>

      <p className="font-semibold max-w-2xl">
        More information about the license is available{" "}
        <a
          href="https://colorlib.com/wp/licence/"
          className="text-blue-600 hover:underline"
        >
          here
        </a>.
      </p>
    </div>
  );
}
