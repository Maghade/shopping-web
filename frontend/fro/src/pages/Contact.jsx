import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../redux/messageSlice";
export default function Contact() {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.messages);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendMessage(formData));
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      {/* Breadcrumb Section */}
      <section
        className="breadcrumb-section set-bg"
        style={{ backgroundImage: "url(img/breadcrumb.jpg)" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="breadcrumb__text">
                <h2>Contact Us</h2>
                <div className="breadcrumb__option">
                  <a href="/">Home</a>
                  <span>Contact Us</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="contact spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-3 col-sm-6 text-center">
              <div className="contact__widget">
                <span className="icon_phone"></span>
                <h4>Phone</h4>
                <p>+ 07949224873</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 text-center">
              <div className="contact__widget">
                <span className="icon_pin_alt"></span>
                <h4>Address</h4>
                <p>
                  Plot No. 11, Near Cid State HQ Behind Police Line Takli,
                  Nagpur-440013, Maharashtra, India
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 text-center">
              <div className="contact__widget">
                <span className="icon_clock_alt"></span>
                <h4>CEO</h4>
                <p>Sameed Khan</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 text-center">
              <div className="contact__widget">
                <span className="icon_mail_alt"></span>
                <h4>Email</h4>
                <p>sfkgroup.16@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <div className="map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.123636166103!2d79.04880057484117!3d21.15750488217418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c07a1b2a40db%3A0x3f3d62e53b4245d4!2sPlot%20No.%2011%2C%20Near%20Cid%20State%20HQ%20Behind%20Police%20Line%20Takli%2C%20Nagpur%2C%20Maharashtra%20440013!5e0!3m2!1sen!2sin!4v1728227166953!5m2!1sen!2sin"
          height="500"
          style={{ border: 0, width: "100%" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>

        <div className="map-inside">
          <i className="icon_pin"></i>
          <div className="inside-widget">
            <h4>Nagpur, India</h4>
            <ul>
              <li>Phone: +91 7949224873</li>
              <li>
                Plot No. 11, Near CID State HQ, Behind Police Line Takli,
                Nagpur-440013, Maharashtra, India
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="p-4 border rounded shadow-sm bg-white">
              <h3 className="text-center mb-4">Leave Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-12">
                    <textarea
                      name="message"
                      className="form-control"
                      placeholder="Your Message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="site-btn"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </div>

                {success && (
                  <p className="text-success text-center mt-3">
                    ✅ Message sent successfully!
                  </p>
                )}
                {error && (
                  <p className="text-danger text-center mt-3">
                    ❌ Failed to send message.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="footer__about">
                <div className="footer__about__logo">
                  <a href="/">
                    <img src="/assets/logo-footer.png" alt="" />
                  </a>
                </div>
                <ul>
                  <h6>Address :</h6>
                  <span>
                    Plot No. 11, Near Cid State HQ Behind Police Line Takli,
                    Nagpur-440013, Maharashtra, India
                  </span>
                  <li>Phone: + 07949224873</li>
                  <li>Email: sfkgroup.16@gmail.com</li>
                </ul>
              </div>
            </div>

            <div className="col-lg-4 col-md-12">
              <form action="#">
                <input type="text" placeholder="Enter your mail" />
                <button type="submit" className="site-btn">
                  Subscribe
                </button>
              </form>
            </div>

            <div className="col-lg-4 col-md-12">
              <div className="footer__widget">
                <h6>Join Our Newsletter Now</h6>
                <p>
                  Get E-mail updates about our latest shop and special offers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
