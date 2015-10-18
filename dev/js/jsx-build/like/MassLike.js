"use strict";

MassLike = React.createClass({
  displayName: "MassLike",

  render: function render() {
    return React.createElement(
      "div",
      { className: "masslike wrap-full-width" },
      React.createElement(
        "div",
        { className: "container" },
        React.createElement(
          "div",
          { className: "masslike-blocked js-masslike-blocked row ", style: { display: 'none' } },
          React.createElement(
            "div",
            { className: "col-md-12" },
            React.createElement("i", { className: "fa fa-circle-o-notch fa-spin" })
          ),
          React.createElement(
            "div",
            { className: "col-md-6 col-md-offset-3" },
            React.createElement(
              "span",
              null,
              "Easy there tiger. Still got ",
              React.createElement(
                "span",
                { className: "js-mass-like-counter", style: { display: 'inline' } },
                "20"
              ),
              " girls left to like."
            ),
            React.createElement("br", null),
            React.createElement(
              "span",
              null,
              "In the meantime, work on ",
              React.createElement(
                "a",
                { href: "#", className: "js-goto-openers" },
                "your openers"
              ),
              ", or ",
              React.createElement(
                "a",
                { href: "#", className: "js-goto-chat" },
                "chat with someone"
              ),
              " you have already matched with."
            )
          )
        ),
        " ",
        React.createElement(
          "div",
          { className: "row masslike-intro js-masslike-intro" },
          React.createElement(
            "div",
            { className: "intro js-switch-bar on col-md-5" },
            React.createElement(
              "div",
              { className: "row" },
              React.createElement(
                "p",
                { className: "status" },
                "Intro messages are ",
                React.createElement("span", { className: "js-intro-message-status" })
              ),
              React.createElement(
                "span",
                { className: "switch switch-square" },
                React.createElement("input", { type: "checkbox", className: "js-intro-switch", id: "s1" }),
                React.createElement("label", { htmlFor: "s1", "data-on": "I", "data-off": "O" })
              )
            ),
            React.createElement(
              "div",
              { className: "row description" },
              React.createElement(
                "p",
                null,
                "Whatever you put in below will sent when you actually match. Even if you match a week from now. Best avoid stuff about weekend plans - most matches happen 2-5 days after you like someone."
              )
            ),
            React.createElement(
              "div",
              { className: "row intro-el" },
              React.createElement(
                "label",
                null,
                "Your intro:"
              ),
              React.createElement("textarea", { className: "js-intro-input", "data-intro-num": 1, id: "intro-input-1", val: true, value: "{first_name}! how's life" }),
              React.createElement(
                "div",
                { className: "js-add-intro-token js-intro-token cp-btn", "data-token": "{first_name}", "data-target-area": "intro-input-1" },
                "insert first name"
              )
            )
          ),
          " ",
          React.createElement(
            "div",
            { className: "masslike col-md-6 col-md-offset-1" },
            React.createElement(
              "div",
              { className: "desc row" },
              React.createElement(
                "span",
                null,
                "Change number of girls to like:"
              )
            ),
            React.createElement(
              "div",
              { className: "select-like-num row" },
              React.createElement(
                "div",
                { className: "like-num-el js-like-num-el", "data-num": 5 },
                "5"
              ),
              React.createElement(
                "div",
                { className: "like-num-el js-like-num-el", "data-num": 20 },
                "20"
              ),
              React.createElement(
                "div",
                { className: "like-num-el js-like-num-el active", "data-num": 50 },
                "50"
              ),
              React.createElement(
                "div",
                { className: "like-num-el js-like-num-el", "data-num": 100 },
                "100"
              ),
              React.createElement(
                "div",
                { className: "like-num-el js-like-num-el", "data-num": 250 },
                "250"
              ),
              React.createElement(
                "div",
                { className: "like-num-el js-like-num-el", "data-num": 500 },
                "500"
              )
            ),
            React.createElement(
              "div",
              { className: "action row" },
              React.createElement(
                "div",
                { className: "col-md-12" },
                React.createElement(
                  "div",
                  { className: "row" },
                  React.createElement(
                    "div",
                    { className: "js-like primary", "data-like-num": 50 },
                    "Swipe right on ",
                    React.createElement(
                      "span",
                      { className: "js-swipe-num" },
                      "50"
                    )
                  )
                ),
                React.createElement(
                  "div",
                  { className: "row js-if-intros-on js-if-toggle" },
                  React.createElement(
                    "div",
                    { className: "col-md-10 col-md-offset-1" },
                    React.createElement(
                      "p",
                      { className: "desc" },
                      "Your intro at left will send to all the matches you get from this group of ",
                      React.createElement(
                        "span",
                        { className: "js-swipe-num" },
                        "likes"
                      ),
                      "."
                    )
                  )
                )
              )
            )
          ),
          " "
        )
      )
    );
  } });
/* ./masslike-blocked */ /* /.intro */ /* /.action */
//# sourceMappingURL=MassLike.js.map
