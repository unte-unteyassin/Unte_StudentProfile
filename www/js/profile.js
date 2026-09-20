const STORAGE_KEY = "studentProfileData";

const defaultProfile = {
    fullName: "Yassin L. Unte",
    course: "BS Information Technology",
    yearLevel: "3rd Year",
    aboutMe: "IT student interested in technology, game development, sports, and building projects.",
    skills: [
        "Programming",
        "Microsoft Office",
        "UI/UX Design",
        "Communication & Teamwork",
        "Troubleshooting",
        "Web Development"
    ],
    profileImage: "images/profile.jpg"
};

const skillDescriptions = {
    "Programming": "Familiar with Python, Java, and basic programming concepts.",
    "Microsoft Office": "Comfortable using Word and Excel for schoolwork and data organization.",
    "UI/UX Design": "Basic experience with Figma, layouts, spacing, and interface design.",
    "Communication & Teamwork": "Able to communicate ideas and work effectively with a team.",
    "Troubleshooting": "Able to solve basic computer and software problems.",
    "Web Development": "Building responsive web pages using HTML and CSS."
};

let pendingProfileImage = null;

function getProfileData() {
    const savedProfile = localStorage.getItem(STORAGE_KEY);

    if (!savedProfile) {
        return defaultProfile;
    }

    try {
        const parsedProfile = JSON.parse(savedProfile);

        return {
            fullName: parsedProfile.fullName || defaultProfile.fullName,
            course: parsedProfile.course || defaultProfile.course,
            yearLevel: parsedProfile.yearLevel || defaultProfile.yearLevel,
            aboutMe: parsedProfile.aboutMe || defaultProfile.aboutMe,
            skills: Array.isArray(parsedProfile.skills)
                ? parsedProfile.skills
                : defaultProfile.skills,
            profileImage:
                parsedProfile.profileImage || defaultProfile.profileImage
        };
    } catch {
        return defaultProfile;
    }
}

function updateProfileText(profile) {
    document
        .querySelectorAll('[data-profile="fullName"]')
        .forEach(function(element) {
            element.textContent = profile.fullName;
        });

    document
        .querySelectorAll('[data-profile="course"]')
        .forEach(function(element) {
            element.textContent = profile.course;
        });

    document
        .querySelectorAll('[data-profile="yearLevel"]')
        .forEach(function(element) {
            element.textContent = profile.yearLevel;
        });

    document
        .querySelectorAll('[data-profile="aboutMe"]')
        .forEach(function(element) {
            element.textContent = profile.aboutMe;
        });
}

function updateProfileImages(profile) {
    document
        .querySelectorAll("[data-profile-image]")
        .forEach(function(image) {
            image.src = profile.profileImage;
        });
}

function updateProfileSkillLists(profile) {
    document
        .querySelectorAll("[data-profile-skills-list]")
        .forEach(function(container) {
            container.innerHTML = "";

            profile.skills.forEach(function(skill) {
                const item = document.createElement("li");

                item.textContent = skill;

                container.appendChild(item);
            });
        });
}

function updateProfileSkillCards(profile) {
    document
        .querySelectorAll("[data-profile-skill-cards]")
        .forEach(function(container) {
            container.innerHTML = "";

            profile.skills.forEach(function(skill, index) {
                const card = document.createElement("article");
                card.className = "skill-card";

                const number = document.createElement("span");
                number.className = "skill-number";
                number.textContent =
                    String(index + 1).padStart(2, "0");

                const title = document.createElement("h2");
                title.textContent = skill;

                const description =
                    document.createElement("p");

                description.textContent =
                    skillDescriptions[skill] ||
                    "A skill I am currently developing and improving.";

                card.appendChild(number);
                card.appendChild(title);
                card.appendChild(description);

                container.appendChild(card);
            });
        });
}

function displayProfile(profile) {
    updateProfileText(profile);
    updateProfileImages(profile);
    updateProfileSkillLists(profile);
    updateProfileSkillCards(profile);
}

function fillEditForm(profile) {
    const fullNameInput =
        document.getElementById("fullName");

    const courseInput =
        document.getElementById("course");

    const yearLevelInput =
        document.getElementById("yearLevel");

    const aboutMeInput =
        document.getElementById("aboutMe");

    const skillsInput =
        document.getElementById("skills");

    if (
        !fullNameInput ||
        !courseInput ||
        !yearLevelInput ||
        !aboutMeInput ||
        !skillsInput
    ) {
        return;
    }

    fullNameInput.value =
        profile.fullName;

    courseInput.value =
        profile.course;

    yearLevelInput.value =
        profile.yearLevel;

    aboutMeInput.value =
        profile.aboutMe;

    skillsInput.value =
        profile.skills.join(", ");
}

function updateImagePreview(imageSource) {
    const preview =
        document.getElementById("editProfilePreview");

    if (preview) {
        preview.src = imageSource;
    }
}

function handleProfilePicture(event) {
    const validationMessage =
        document.getElementById("validationMessage");

    const file =
        event.target.files[0];

    if (!file) {
        return;
    }

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
        validationMessage.textContent =
            "Please choose a JPG, PNG, or WEBP image.";

        event.target.value = "";

        return;
    }

    const maximumSize =
        2 * 1024 * 1024;

    if (file.size > maximumSize) {
        validationMessage.textContent =
            "Profile picture must be 2 MB or smaller.";

        event.target.value = "";

        return;
    }

    const reader =
        new FileReader();

    reader.onload =
        function(loadEvent) {
            pendingProfileImage =
                loadEvent.target.result;

            updateImagePreview(
                pendingProfileImage
            );

            validationMessage.textContent =
                "";
        };

    reader.readAsDataURL(file);
}

function openEditProfile() {
    const editProfileSection =
        document.getElementById(
            "editProfileSection"
        );

    const validationMessage =
        document.getElementById(
            "validationMessage"
        );

    const profilePictureInput =
        document.getElementById(
            "profilePicture"
        );

    if (!editProfileSection) {
        return;
    }

    const currentProfile =
        getProfileData();

    pendingProfileImage =
        currentProfile.profileImage;

    fillEditForm(currentProfile);

    updateImagePreview(
        currentProfile.profileImage
    );

    if (profilePictureInput) {
        profilePictureInput.value = "";
    }

    if (validationMessage) {
        validationMessage.textContent = "";
    }

    editProfileSection.classList.remove(
        "hidden"
    );

    editProfileSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function closeEditProfile() {
    const editProfileSection =
        document.getElementById(
            "editProfileSection"
        );

    const validationMessage =
        document.getElementById(
            "validationMessage"
        );

    if (!editProfileSection) {
        return;
    }

    if (validationMessage) {
        validationMessage.textContent = "";
    }

    editProfileSection.classList.add(
        "hidden"
    );
}

function validateProfile() {
    const fullName =
        document
            .getElementById("fullName")
            .value
            .trim();

    const course =
        document
            .getElementById("course")
            .value
            .trim();

    const yearLevel =
        document
            .getElementById("yearLevel")
            .value
            .trim();

    const aboutMe =
        document
            .getElementById("aboutMe")
            .value
            .trim();

    if (fullName === "") {
        return "Please enter your full name.";
    }

    if (course === "") {
        return "Please enter your course.";
    }

    if (yearLevel === "") {
        return "Please enter your year level.";
    }

    if (aboutMe === "") {
        return "Please enter information about yourself.";
    }

    return "";
}

function saveProfile(event) {
    event.preventDefault();

    const validationMessage =
        document.getElementById(
            "validationMessage"
        );

    const validationResult =
        validateProfile();

    if (validationResult !== "") {
        validationMessage.textContent =
            validationResult;

        return;
    }

    const skillsInput =
        document
            .getElementById("skills")
            .value;

    const skills =
        skillsInput
            .split(",")
            .map(function(skill) {
                return skill.trim();
            })
            .filter(function(skill) {
                return skill !== "";
            });

    const updatedProfile = {
        fullName:
            document
                .getElementById("fullName")
                .value
                .trim(),

        course:
            document
                .getElementById("course")
                .value
                .trim(),

        yearLevel:
            document
                .getElementById("yearLevel")
                .value
                .trim(),

        aboutMe:
            document
                .getElementById("aboutMe")
                .value
                .trim(),

        skills: skills,

        profileImage:
            pendingProfileImage ||
            getProfileData().profileImage
    };

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedProfile)
        );
    } catch {
        validationMessage.textContent =
            "Unable to save the profile. Try using a smaller profile picture.";

        return;
    }

    displayProfile(updatedProfile);

    closeEditProfile();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function cancelEdit() {
    const currentProfile =
        getProfileData();

    pendingProfileImage =
        currentProfile.profileImage;

    const profilePictureInput =
        document.getElementById(
            "profilePicture"
        );

    if (profilePictureInput) {
        profilePictureInput.value = "";
    }

    fillEditForm(currentProfile);

    updateImagePreview(
        currentProfile.profileImage
    );

    closeEditProfile();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.addEventListener(
    "DOMContentLoaded",
    function() {
        const profile =
            getProfileData();

        displayProfile(profile);

        const editProfileButton =
            document.getElementById(
                "editProfileButton"
            );

        const profileForm =
            document.getElementById(
                "profileForm"
            );

        const cancelButton =
            document.getElementById(
                "cancelButton"
            );

        const profilePictureInput =
            document.getElementById(
                "profilePicture"
            );

        if (editProfileButton) {
            editProfileButton.addEventListener(
                "click",
                openEditProfile
            );
        }

        if (profileForm) {
            profileForm.addEventListener(
                "submit",
                saveProfile
            );
        }

        if (cancelButton) {
            cancelButton.addEventListener(
                "click",
                cancelEdit
            );
        }

        if (profilePictureInput) {
            profilePictureInput.addEventListener(
                "change",
                handleProfilePicture
            );
        }
    }
);