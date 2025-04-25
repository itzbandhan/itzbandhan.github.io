document.addEventListener("DOMContentLoaded", function () {
  const photoInputs = document.getElementById("photo-inputs");
  const addPhotoBtn = document.getElementById("add-photo-btn");
  const form = document.querySelector(".upload-form");

  // Set default year to current year
  const yearInput = document.getElementById("year");
  yearInput.value = new Date().getFullYear();

  // Set default month to current month
  const monthSelect = document.getElementById("month");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonth = new Date().getMonth();
  monthSelect.value = months[currentMonth];

  // Add new photo field
  addPhotoBtn.addEventListener("click", function () {
    const photoGroup = document.createElement("div");
    photoGroup.className = "photo-input-group";
    photoGroup.innerHTML = `
            <input type="file" name="photos" accept="image/*" required>
            <input type="text" name="captions" placeholder="Caption (optional)">
            <button type="button" class="remove-photo-btn">
                <i class="fas fa-times"></i>
            </button>
            <div class="image-preview"></div>
        `;

    photoInputs.appendChild(photoGroup);

    // Add event listener for the new file input
    const fileInput = photoGroup.querySelector('input[type="file"]');
    fileInput.addEventListener("change", function (e) {
      previewImage(this);
    });

    // Add remove functionality
    photoGroup
      .querySelector(".remove-photo-btn")
      .addEventListener("click", function () {
        if (photoInputs.children.length > 1) {
          photoInputs.removeChild(photoGroup);
        } else {
          alert("You need at least one photo!");
        }
      });
  });

  // Image preview functionality
  function previewImage(input) {
    const previewContainer = input
      .closest(".photo-input-group")
      .querySelector(".image-preview");
    previewContainer.innerHTML = "";

    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.maxWidth = "100px";
        img.style.maxHeight = "100px";
        previewContainer.appendChild(img);
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  // Add preview to existing file inputs
  document.querySelectorAll('input[type="file"]').forEach((input) => {
    input.addEventListener("change", function () {
      previewImage(this);
    });
  });

  // Form submission handling
  form.addEventListener("submit", function (e) {
    // You could add client-side validation here
    // For example:
    const title = document.getElementById("title").value.trim();
    if (!title) {
      e.preventDefault();
      alert("Please enter a title for this memory");
      return;
    }

    // Validate at least one photo is selected
    const fileInputs = document.querySelectorAll('input[type="file"]');
    let hasFile = false;
    fileInputs.forEach((input) => {
      if (input.files && input.files[0]) {
        hasFile = true;
      }
    });

    if (!hasFile) {
      e.preventDefault();
      alert("Please select at least one photo");
    }
  });
});
