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

let cordovaReady = false;

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

function saveProfileData(profile) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(profile)
    );
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

function openEditProfile() {
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

    fillEditForm(
        getProfileData()
    );

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

    const currentProfile =
        getProfileData();

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
            currentProfile.profileImage
    };

    saveProfileData(
        updatedProfile
    );

    displayProfile(
        updatedProfile
    );

    closeEditProfile();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function cancelEdit() {
    fillEditForm(
        getProfileData()
    );

    closeEditProfile();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function setCameraMessage(message, isError) {
    const cameraMessage =
        document.getElementById(
            "cameraMessage"
        );

    if (!cameraMessage) {
        return;
    }

    cameraMessage.textContent =
        message;

    if (isError) {
        cameraMessage.classList.add(
            "camera-error"
        );
    } else {
        cameraMessage.classList.remove(
            "camera-error"
        );
    }
}

function setCameraButtonBusy(isBusy) {
    const button =
        document.getElementById(
            "changeProfilePictureButton"
        );

    if (!button) {
        return;
    }

    button.disabled =
        isBusy;

    button.textContent =
        isBusy
            ? "Opening Camera..."
            : "Change Profile Picture";
}

function isCameraCancellation(message) {
    const text =
        String(message || "")
            .toLowerCase();

    return (
        text.includes("cancel") ||
        text.includes("no image selected") ||
        text.includes("no image")
    );
}

function cameraError(message) {
    setCameraButtonBusy(false);

    if (isCameraCancellation(message)) {
        setCameraMessage(
            "Camera cancelled. Your current profile picture was kept.",
            false
        );

        return;
    }

    const errorText =
        String(message || "")
            .toLowerCase();

    if (
        errorText === "20" ||
        errorText.includes("permission") ||
        errorText.includes("denied")
    ) {
        setCameraMessage(
            "Unable to access the camera. Please check your camera permission.",
            true
        );

        return;
    }

    setCameraMessage(
        "Unable to access the camera. Please try again.",
        true
    );
}

function fileError() {
    setCameraButtonBusy(false);

    setCameraMessage(
        "The photo was captured, but the application could not save it.",
        true
    );
}

function saveCapturedImage(imageUri) {
    if (
        typeof window.resolveLocalFileSystemURL !==
        "function"
    ) {
        fileError();
        return;
    }

    if (
        typeof cordova === "undefined" ||
        !cordova.file ||
        !cordova.file.dataDirectory
    ) {
        fileError();
        return;
    }

    window.resolveLocalFileSystemURL(
        imageUri,

        function(fileEntry) {
            window.resolveLocalFileSystemURL(
                cordova.file.dataDirectory,

                function(dataDirectoryEntry) {
                    const fileName =
                        "profile-picture-" +
                        Date.now() +
                        ".jpg";

                    fileEntry.copyTo(
                        dataDirectoryEntry,
                        fileName,

                        function(copiedEntry) {
                            const persistentImageUri =
                                copiedEntry.toURL();

                            const profile =
                                getProfileData();

                            profile.profileImage =
                                persistentImageUri;

                            saveProfileData(
                                profile
                            );

                            updateProfileImages(
                                profile
                            );

                            setCameraButtonBusy(
                                false
                            );

                            setCameraMessage(
                                "Profile picture updated successfully.",
                                false
                            );
                        },

                        fileError
                    );
                },

                fileError
            );
        },

        fileError
    );
}

function cameraSuccess(imageUri) {
    saveCapturedImage(
        imageUri
    );
}

function openCamera() {
    setCameraMessage(
        "",
        false
    );

    if (!cordovaReady) {
        setCameraMessage(
            "Camera is still initializing. Please try again.",
            true
        );

        return;
    }

    if (
        !navigator.camera ||
        typeof Camera === "undefined"
    ) {
        setCameraMessage(
            "Camera feature is unavailable on this device.",
            true
        );

        return;
    }

    setCameraButtonBusy(
        true
    );

    navigator.camera.getPicture(
        cameraSuccess,
        cameraError,
        {
            quality: 70,
            destinationType:
                Camera.DestinationType.FILE_URI,
            sourceType:
                Camera.PictureSourceType.CAMERA,
            encodingType:
                Camera.EncodingType.JPEG,
            mediaType:
                Camera.MediaType.PICTURE,
            cameraDirection:
                Camera.Direction.FRONT,
            correctOrientation: true,
            targetWidth: 1200,
            targetHeight: 1200,
            saveToPhotoAlbum: false
        }
    );
}

function initializePage() {
    const profile =
        getProfileData();

    displayProfile(
        profile
    );

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

    const cameraButton =
        document.getElementById(
            "changeProfilePictureButton"
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

    if (cameraButton) {
        cameraButton.addEventListener(
            "click",
            openCamera
        );
    }
}

function onDeviceReady() {
    cordovaReady = true;

    setCameraMessage(
        "",
        false
    );
}

if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        initializePage
    );
} else {
    initializePage();
}

document.addEventListener(
    "deviceready",
    onDeviceReady,
    false
);