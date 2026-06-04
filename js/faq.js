// FAQ Accordion functionality
document.addEventListener("DOMContentLoaded", function () {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", function () {
      const isActive = this.classList.contains("active");

      // Close all FAQ items
      faqQuestions.forEach((q) => {
        q.classList.remove("active");
        q.nextElementSibling.classList.remove("active");
      });

      // Open clicked item if it wasn't active
      if (!isActive) {
        this.classList.add("active");
        this.nextElementSibling.classList.add("active");
      }
    });
  });
});
