const courseContent = {
  title: "Introduction to Web Development",
  modules: [
    {
      title: "What is Web Development?",
      content: [
        {
          type: "paragraph",
          text: "Web development is the process of building and maintaining websites. It involves a combination of frontend development (what users see and interact with), backend development (server-side logic and databases), and full stack development (both frontend and backend)."
        },
        {
          type: "heading",
          text: "The Core Technologies"
        },
        {
          type: "list",
          items: [
            "HTML: Structure",
            "CSS: Presentation",
            "JavaScript: Behavior"
          ]
        },
        {
          type: "heading",
          text: "Why Learn Web Development?"
        },
        {
          type: "list",
          items: [
            "High demand skills in job market",
            "Create your own websites and applications",
            "Understand how the web works",
            "Express creativity through code"
          ]
        }
      ],
      exercise: {
        title: "Research Exercise",
        description: "Research a website you use regularly. What features do you notice? Try to identify which parts might be HTML, CSS, or JavaScript. Share your findings in the text area below."
      },
      quiz: [
        {
          question: "What does HTML stand for?",
          options: [
            "Hyper Transfer Markup Language",
            "Hypertext Markup Language",
            "Home Tool Markup Language",
            "Hyper Technical Modern Language"
          ],
          correctAnswer: 1
        },
        {
          question: "Which of these is NOT a core web technology?",
          options: [
            "HTML",
            "CSS",
            "JavaScript",
            "Python"
          ],
          correctAnswer: 3
        }
      ]
    },
    {
      title: "HTML Basics",
      content: [
        {
          type: "paragraph",
          text: "HTML (Hypertext Markup Language) is the backbone of any webpage. It provides the structure and content."
        },
        {
          type: "heading",
          text: "HTML Document Structure"
        },
        {
          type: "code",
          language: "html",
          code: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>My First Webpage</title>\n  </head>\n  <body>\n    <h1>Hello, World!</h1>\n    <p>This is my first web page.</p>\n  </body>\n</html>`
        },
        {
          type: "heading",
          text: "Common HTML Elements"
        },
        {
          type: "list",
          items: [
            "Headings: <h1> to <h6>",
            "Paragraphs: <p>",
            "Links: <a href=\"https://example.com\">Visit Example</a>",
            "Images: <img src=\"image.jpg\" alt=\"Description\">",
            "Lists: Ordered <ol><li>Item</li></ol> and Unordered <ul><li>Item</li></ul>",
            "Divs: <div> (container for grouping elements)",
            "Spans: <span> (inline container for text)"
          ]
        },
        {
          type: "heading",
          text: "HTML Attributes"
        },
        {
          type: "paragraph",
          text: "Attributes provide additional information about HTML elements:"
        },
        {
          type: "code",
          language: "html",
          code: `<a href="https://example.com" target="_blank">Visit Example</a>\n<!-- href and target are attributes -->`
        }
      ],
      exercise: {
        title: "Create a Simple HTML Page",
        description: "Create a simple HTML page about yourself with:\n- A heading with your name\n- A paragraph about your hobbies\n- A list of your favorite websites (with links)\n- An image (if you have one)"
      },
      quiz: [
        {
          question: "Which HTML tag is used for the main heading?",
          options: [
            "<heading>",
            "<h6>",
            "<h1>",
            "<head>"
          ],
          correctAnswer: 2
        },
        {
          question: "Which attribute specifies where to open the linked document?",
          options: [
            "href",
            "target",
            "src",
            "alt"
          ],
          correctAnswer: 1
        },
        {
          question: "What is the correct HTML for creating a hyperlink?",
          options: [
            '<a url="http://www.example.com">Example</a>',
            '<a>http://www.example.com</a>',
            '<a href="http://www.example.com">Example</a>',
            '<link href="http://www.example.com">Example</link>'
          ],
          correctAnswer: 2
        }
      ]
    },
    {
      title: "CSS Fundamentals",
      content: [
        {
          type: "paragraph",
          text: "CSS (Cascading Style Sheets) controls the presentation and layout of web pages."
        },
        {
          type: "heading",
          text: "How to Include CSS"
        },
        {
          type: "paragraph",
          text: "There are three ways to include CSS in your HTML documents:"
        },
        {
          type: "heading",
          text: "1. Inline CSS"
        },
        {
          type: "code",
          language: "html",
          code: `<p style="color: blue; font-size: 18px;">This is a blue paragraph.</p>`
        },
        {
          type: "heading",
          text: "2. Internal CSS"
        },
        {
          type: "code",
          language: "html",
          code: `<head>\n  <style>\n    p {\n      color: blue;\n      font-size: 18px;\n    }\n  </style>\n</head>`
        },
        {
          type: "heading",
          text: "3. External CSS (preferred method)"
        },
        {
          type: "code",
          language: "html",
          code: `<head>\n  <link rel="stylesheet" href="styles.css">\n</head>`
        },
        {
          type: "heading",
          text: "CSS Selectors"
        },
        {
          type: "code",
          language: "css",
          code: `/* Element Selector */\np {\n  color: blue;\n}\n\n/* Class Selector */\n.highlight {\n  background-color: yellow;\n}\n\n/* ID Selector */\n#header {\n  font-size: 24px;\n}\n\n/* Descendant Selector */\ndiv p {\n  margin-left: 20px;\n}`
        },
        {
          type: "heading",
          text: "Common CSS Properties"
        },
        {
          type: "code",
          language: "css",
          code: `p {\n  color: #333;              /* Text color */\n  background-color: #f0f0f0; /* Background color */\n  font-family: Arial, sans-serif; /* Font */\n  font-size: 16px;          /* Font size */\n  font-weight: bold;        /* Font weight */\n  margin: 10px;             /* Margin around element */\n  padding: 15px;            /* Padding inside element */\n  border: 1px solid black;  /* Border */\n  width: 80%;               /* Width */\n  height: 100px;            /* Height */\n  text-align: center;       /* Text alignment */\n}`
        },
        {
          type: "heading",
          text: "The Box Model"
        },
        {
          type: "paragraph",
          text: "Every HTML element is a box with content, padding (space inside the box), border, and margin (space outside the box)."
        }
      ],
      exercise: {
        title: "Style Your HTML Page",
        description: "Style the HTML page you created in the previous exercise:\n- Change the background color of the page\n- Add custom colors to your headings\n- Change the font family and size of paragraphs\n- Add borders around your lists\n- Add hover effects to links"
      },
      quiz: [
        {
          question: "Which property is used to change the text color of an element?",
          options: [
            "font-color",
            "text-color",
            "color",
            "text-style"
          ],
          correctAnswer: 2
        },
        {
          question: "What does CSS stand for?",
          options: [
            "Creative Style Sheets",
            "Computer Style Sheets",
            "Cascading Style Sheets",
            "Colorful Style Sheets"
          ],
          correctAnswer: 2
        }
      ]
    },
    {
      title: "JavaScript Basics",
      content: [
        {
          type: "paragraph",
          text: "JavaScript makes web pages interactive and dynamic."
        },
        {
          type: "heading",
          text: "How to Include JavaScript"
        },
        {
          type: "code",
          language: "html",
          code: `<!-- Internal JavaScript -->\n<script>\n  alert("Hello, World!");\n</script>\n\n<!-- External JavaScript (preferred) -->\n<script src="script.js"></script>`
        },
        {
          type: "heading",
          text: "Variables and Data Types"
        },
        {
          type: "code",
          language: "javascript",
          code: `// Variables\nlet name = "John";           // String\nconst age = 25;              // Number\nvar isStudent = true;        // Boolean\n\n// Modern way (use these)\nlet score = 85;              // Can be reassigned\nconst PI = 3.14159;          // Cannot be reassigned`
        },
        {
          type: "heading",
          text: "Basic JavaScript Syntax"
        },
        {
          type: "code",
          language: "javascript",
          code: `// Output to console\nconsole.log("Hello, World!");\n\n// Alert dialog\nalert("This is an alert!");\n\n// Functions\nfunction greet(name) {\n  return "Hello, " + name + "!";\n}\n\n// Modern arrow function\nconst greet = (name) => {\n  return \`Hello, \${name}!\`;  // Template string\n};\n\n// Conditionals\nif (age >= 18) {\n  console.log("You are an adult");\n} else {\n  console.log("You are a minor");\n}\n\n// Loops\nfor (let i = 0; i < 5; i++) {\n  console.log(\`Number \${i}\`);\n}`
        },
        {
          type: "heading",
          text: "DOM Manipulation"
        },
        {
          type: "code",
          language: "javascript",
          code: `// Select elements\nconst heading = document.getElementById("title");\nconst paragraphs = document.getElementsByTagName("p");\nconst buttons = document.querySelectorAll(".btn");\n\n// Change content\nheading.textContent = "New Title";\nheading.innerHTML = "<span>New</span> Title";\n\n// Change styles\nheading.style.color = "blue";\nheading.style.fontSize = "24px";\n\n// Event handling\nconst button = document.querySelector("#myButton");\nbutton.addEventListener("click", function() {\n  alert("Button clicked!");\n});`
        }
      ],
      exercise: {
        title: "Add JavaScript to Your Page",
        description: "Add JavaScript to your HTML page:\n- Create a button that changes the background color when clicked\n- Add a form that validates input (e.g., checks if a field is empty)\n- Create an interactive element that responds to mouse hover"
      },
      quiz: [
        {
          question: "Which is the correct way to write a JavaScript array?",
          options: [
            'var colors = "red", "green", "blue"',
            'var colors = ["red", "green", "blue"]',
            'var colors = (1:"red"), 2=("green"), 3=("blue")'
          ],
          correctAnswer: 1
        },
        {
          question: 'How do you write "Hello World" in an alert box?',
          options: [
            'alert("Hello World");',
            'alertBox("Hello World");',
            'msg("Hello World");',
            'msgBox("Hello World");'
          ],
          correctAnswer: 0
        }
      ]
    },
    {
      title: "Build Your First Web Page",
      content: [
        {
          type: "paragraph",
          text: "Let's put everything together to build a complete web page."
        },
        {
          type: "heading",
          text: "Project: Personal Portfolio Page"
        },
        {
          type: "code",
          language: "html",
          code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Portfolio</title>\n  <style>\n    body {\n      font-family: 'Arial', sans-serif;\n      line-height: 1.6;\n      margin: 0;\n      padding: 0;\n      background-color: #f4f4f4;\n    }\n    \n    header {\n      background-color: #333;\n      color: #fff;\n      text-align: center;\n      padding: 2rem;\n    }\n    \n    .container {\n      width: 80%;\n      margin: auto;\n      overflow: hidden;\n      padding: 2rem 0;\n    }\n    \n    .project {\n      background: #fff;\n      margin-bottom: 2rem;\n      padding: 1rem;\n      border-radius: 5px;\n      box-shadow: 0 2px 5px rgba(0,0,0,0.1);\n    }\n    \n    footer {\n      background: #333;\n      color: #fff;\n      text-align: center;\n      padding: 1rem;\n      margin-top: 2rem;\n    }\n    \n    /* Responsive design */\n    @media(max-width: 700px) {\n      .container {\n        width: 95%;\n      }\n    }\n  </style>\n</head>\n<body>\n  <header>\n    <h1>John Doe</h1>\n    <p>Web Developer</p>\n  </header>\n  \n  <div class="container">\n    <section>\n      <h2>About Me</h2>\n      <p>I'm a passionate web developer who loves creating beautiful, functional websites.</p>\n    </section>\n    \n    <section>\n      <h2>My Projects</h2>\n      <div class="project">\n        <h3>Project 1</h3>\n        <p>A website for a local business.</p>\n      </div>\n      <div class="project">\n        <h3>Project 2</h3>\n        <p>A personal blog site.</p>\n      </div>\n    </section>\n    \n    <section>\n      <h2>Contact Me</h2>\n      <form id="contact-form">\n        <div>\n          <label for="name">Name:</label>\n          <input type="text" id="name" required>\n        </div>\n        <div>\n          <label for="email">Email:</label>\n          <input type="email" id="email" required>\n        </div>\n        <div>\n          <label for="message">Message:</label>\n          <textarea id="message" required></textarea>\n        </div>\n        <button type="submit">Send</button>\n      </form>\n    </section>\n  </div>\n  \n  <footer>\n    <p>&copy; 2023 John Doe</p>\n  </footer>\n\n  <script>\n    document.getElementById('contact-form').addEventListener('submit', function(event) {\n      event.preventDefault();\n      \n      const name = document.getElementById('name').value;\n      const email = document.getElementById('email').value;\n      const message = document.getElementById('message').value;\n      \n      if(name && email && message) {\n        alert(\`Thanks for your message, \${name}! I'll get back to you soon.\`);\n        this.reset();\n      } else {\n        alert('Please fill out all fields.');\n      }\n    });\n  </script>\n</body>\n</html>`
        }
      ],
      exercise: {
        title: "Customize the Portfolio Template",
        description: "Modify the portfolio template:\n- Add your own information\n- Add a different color scheme\n- Add more projects with descriptions and images\n- Enhance the styling with animations or transitions\n- Add additional JavaScript functionality"
      },
      quiz: [
        {
          question: "What are the three main technologies used in web development?",
          options: [
            "HTML, Python, CSS",
            "Java, HTML, SQL",
            "HTML, CSS, JavaScript",
            "XML, CSS, jQuery"
          ],
          correctAnswer: 2
        },
        {
          question: "Which part of the web page is displayed in the browser tab?",
          options: [
            "<h1> content",
            "<title> content",
            "<header> content",
            "<meta> content"
          ],
          correctAnswer: 1
        }
      ]
    },
    {
      title: "Responsive Design",
      content: [
        {
          type: "paragraph",
          text: "Responsive design ensures your website looks good on all devices."
        },
        {
          type: "heading",
          text: "Media Queries"
        },
        {
          type: "code",
          language: "css",
          code: `/* Mobile-first approach */\nbody {\n  font-size: 16px;\n}\n\n/* Tablets and larger */\n@media (min-width: 768px) {\n  body {\n    font-size: 18px;\n  }\n}\n\n/* Desktops and larger */\n@media (min-width: 1024px) {\n  body {\n    font-size: 20px;\n  }\n}`
        },
        {
          type: "heading",
          text: "Flexible Grids"
        },
        {
          type: "code",
          language: "css",
          code: `.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n  gap: 20px;\n}\n\n/* Or using flexbox */\n.container {\n  display: flex;\n  flex-wrap: wrap;\n}\n\n.item {\n  flex: 1 1 300px; /* Grow, shrink, basis */\n  margin: 10px;\n}`
        },
        {
          type: "heading",
          text: "Viewport Meta Tag"
        },
        {
          type: "code",
          language: "html",
          code: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
        },
        {
          type: "heading",
          text: "Responsive Images"
        },
        {
          type: "code",
          language: "css",
          code: `img {\n  max-width: 100%;\n  height: auto;\n}`
        }
      ],
      exercise: {
        title: "Make Your Portfolio Responsive",
        description: "Make your portfolio page responsive:\n- Ensure all elements adapt to different screen sizes\n- Test on mobile, tablet, and desktop views\n- Implement a responsive navigation menu"
      },
      quiz: [
        {
          question: "What does the viewport meta tag do?",
          options: [
            "Increases the website's search engine ranking",
            "Ensures the page scales correctly on different devices",
            "Prevents users from zooming on mobile devices",
            "Redirects mobile users to a mobile-specific website"
          ],
          correctAnswer: 1
        },
        {
          question: "Which CSS property creates a flexible grid layout?",
          options: [
            "float",
            "position",
            "display: grid",
            "align-items"
          ],
          correctAnswer: 2
        }
      ]
    }
  ]
};

export default courseContent; 