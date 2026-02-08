import React from 'react';

export default function Checkout() {
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
                <h2>Checkout</h2>
                <div className="breadcrumb__option">
                  <a href="/">Home</a>
                  <span>Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Section */}
      <section className="checkout spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h6>
                <span className="icon_tag_alt"></span> Have a coupon?{" "}
                <a href="#">Click here</a> to enter your code
              </h6>
            </div>
          </div>
          <div className="checkout__form">
            <h4>Billing Details</h4>
            <form action="#">
              <div className="row">
                <div className="col-lg-8 col-md-6">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="checkout__input">
                        <p>
                          First Name <span>*</span>
                        </p>
                        <input type="text" />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="checkout__input">
                        <p>
                          Last Name <span>*</span>
                        </p>
                        <input type="text" />
                      </div>
                    </div>
                  </div>
                  <div className="checkout__input">
                    <p>
                      Country <span>*</span>
                    </p>
                    <input type="text" />
                  </div>
                  <div className="checkout__input">
                    <p>
                      Address <span>*</span>
                    </p>
                    <input
                      type="text"
                      placeholder="Street Address"
                      className="checkout__input__add"
                    />
                    <input
                      type="text"
                      placeholder="Apartment, suite, unit, etc. (optional)"
                    />
                  </div>
                  <div className="checkout__input">
                    <p>
                      Town/City <span>*</span>
                    </p>
                    <input type="text" />
                  </div>
                  <div className="checkout__input">
                    <p>
                      Country/State <span>*</span>
                    </p>
                    <input type="text" />
                  </div>
                  <div className="checkout__input">
                    <p>
                      Postcode / ZIP <span>*</span>
                    </p>
                    <input type="text" />
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="checkout__input">
                        <p>
                          Phone <span>*</span>
                        </p>
                        <input type="text" />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="checkout__input">
                        <p>
                          Email <span>*</span>
                        </p>
                        <input type="text" />
                      </div>
                    </div>
                  </div>

                  <div className="checkout__input__checkbox">
                    <label htmlFor="acc">
                      Create an account?
                      <input type="checkbox" id="acc" />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <p>
                    Create an account by entering the information below. If you
                    are a returning customer, please login at the top of the page.
                  </p>

                  <div className="checkout__input">
                    <p>
                      Account Password <span>*</span>
                    </p>
                    <input type="text" />
                  </div>

                  <div className="checkout__input__checkbox">
                    <label htmlFor="diff-acc">
                      Ship to a different address?
                      <input type="checkbox" id="diff-acc" />
                      <span className="checkmark"></span>
                    </label>
                  </div>

                  <div className="checkout__input">
                    <p>Order notes</p>
                    <input
                      type="text"
                      placeholder="Notes about your order, e.g. special notes for delivery."
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="col-lg-4 col-md-6">
                  <div className="checkout__order">
                    <h4>Your Order</h4>
                    <div className="checkout__order__products">
                      Products <span>Total</span>
                    </div>
                    <ul>
                      <li>Vegetable’s Package <span>$75.99</span></li>
                      <li>Fresh Vegetable <span>$151.99</span></li>
                      <li>Organic Bananas <span>$53.99</span></li>
                    </ul>
                    <div className="checkout__order__subtotal">
                      Subtotal <span>$750.99</span>
                    </div>
                    <div className="checkout__order__total">
                      Total <span>$750.99</span>
                    </div>

                    <div className="checkout__input__checkbox">
                      <label htmlFor="acc-or">
                        I have read and accept the terms and conditions
                        <input type="checkbox" id="acc-or" />
                        <span className="checkmark"></span>
                      </label>
                    </div>

                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>

                    <div className="checkout__input__checkbox">
                      <label htmlFor="payment">
                        Check Payment
                        <input type="checkbox" id="payment" />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className="checkout__input__checkbox">
                      <label htmlFor="paypal">
                        Paypal
                        <input type="checkbox" id="paypal" />
                        <span className="checkmark"></span>
                      </label>
                    </div>

                    <button type="submit" className="site-btn">
                      PLACE ORDER
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="footer__about">
                <div className="footer__about__logo">
                  <a href="/">
                    <img src="/assets/logo-footer.png" alt="" />
                  </a>
                </div>
                <ul>
                  <li>Address: 60-49 Road 11378 New York</li>
                  <li>Phone: +65 11.188.888</li>
                  <li>Email: hello@colorlib.com</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-6 offset-lg-1">
              <div className="footer__widget">
                <h6>Useful Links</h6>
                <ul>
                  <li>
                    <a href="#">About Us</a>
                  </li>
                  <li>
                    <a href="#">About Our Shop</a>
                  </li>
                  <li>
                    <a href="#">Secure Shopping</a>
                  </li>
                  <li>
                    <a href="#">Delivery information</a>
                  </li>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#">Our Sitemap</a>
                  </li>
                </ul>
                <ul>
                  <li>
                    <a href="#">Who We Are</a>
                  </li>
                  <li>
                    <a href="#">Our Services</a>
                  </li>
                  <li>
                    <a href="#">Projects</a>
                  </li>
                  <li>
                    <a href="#">Contact</a>
                  </li>
                  <li>
                    <a href="#">Innovation</a>
                  </li>
                  <li>
                    <a href="#">Testimonials</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-md-12">
              <div className="footer__widget">
                <h6>Join Our Newsletter Now</h6>
                <p>
                  Get E-mail updates about our latest shop and special offers.
                </p>
                <form action="#">
                  <input type="text" placeholder="Enter your mail" />
                  <button type="submit" className="site-btn">
                    Subscribe
                  </button>
                </form>
                <div className="footer__widget__social">
                  <a href="#">
                    <i className="fa fa-facebook"></i>
                  </a>
                  <a href="#">
                    <i className="fa fa-instagram"></i>
                  </a>
                  <a href="#">
                    <i className="fa fa-twitter"></i>
                  </a>
                  <a href="#">
                    <i className="fa fa-pinterest"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="footer__copyright">
                <div className="footer__copyright__text">
                  <p>
                    Copyright &copy; All rights reserved | This template is made
                    with{" "}
                    <i className="fa fa-heart" aria-hidden="true"></i> by{" "}
                    <a
                      href="https://colorlib.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Colorlib
                    </a>
                  </p>
                </div>
                <div className="footer__copyright__payment">
                  <img src="/assets/payment.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}