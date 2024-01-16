let slideIndex = {}
let projects = {}

window.addEventListener("DOMContentLoaded", event => {
	loadDoc()
})

function closeWindows() {
	windows = Array.from(document.getElementsByClassName("info"))
	windows.forEach(function (window) {
		window.className = "info"
	})
}

function loadBackground() {
	document.getElementById("background").style.backgroundImage =
		"url(assets/background.gif)"
}

function loadDoc() {
	const xhttp = new XMLHttpRequest()
	xhttp.onload = function () {
		const projects = JSON.parse(this.responseText)
		projects.forEach(formatProjects)
		Zoom(".project-gallery img")
		let params = new URL(document.location).searchParams
		if (params.has("autoload")) {
			params.get("autoload")
			document.getElementById(params.get("autoload")).scrollIntoView(true)
		}
	}
	xhttp.open("GET", "projects.json", true)
	return xhttp.send()
}

function formatProjects(project) {
	slideIndex[project.id] = 1
	projects[project.id] = project

	let projectDom = document.getElementById("cloned-card").cloneNode(true)
	projectDom.id = project.id
	projectDom.querySelector(".project-title").textContent = project.title
	projectDom.querySelector(".project-content").textContent =
		project.description
	if (project.icon) {
		projectDom.querySelector(".project-icon").src =
			"assets/projects/" + project.icon
	} else {
		projectDom.querySelector(".project-icon").style.display = "none"
	}

	if (project.technologies) {
		let techLis = ""
		project.technologies.forEach(project => {
			techLis += `<li>${project}</li>`
		})
		projectDom.querySelector(".project-tech").innerHTML = techLis
	}

	if (project.link.title != "") {
		projectDom.querySelector(".project-link").innerHTML += project.link.title
		projectDom.querySelector(".project-link").href = project.link.url
	} else {
		projectDom.querySelector(".project-link").remove()
	}

	if (project.images.length) {
		if (project.images.length == 1) {
			projectDom.querySelectorAll(".w3-button").forEach(function (val) {
				val.remove()
			})
		}
		projectDom.querySelector(".project-img-desc").textContent =
			project.images[project.images.length - 1].title

		let projectImgs = ""
		project.images.forEach(function (val) {
			projectImgs += `<img data-title="${val.title}" src="assets/projects/${val.url}">`
		})
		const gallery = projectDom.querySelector(".project-gallery")
		gallery.insertAdjacentHTML("afterbegin", projectImgs)
	} else {
		projectDom.querySelector(".project-gallery").remove()
		projectDom.querySelector(".project-img-desc").remove()
	}

	document.getElementById("Projects").append(projectDom)
}

function plusDivs(n, e) {
	const projectId = e.currentTarget.closest(".project-card").id
	showDivs((slideIndex[projectId] += n), projectId)
}

function showDivs(n, projectId) {
	const project = document.querySelector("#" + projectId)
	var x = project.querySelectorAll(".project-gallery img")
	if (n > x.length) {
		slideIndex[projectId] = 1
	}
	if (n < 1) {
		slideIndex[projectId] = x.length
	}
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none"
	}
	x[slideIndex[projectId] - 1].style.display = "block"
	project.querySelector(".project-img-desc").textContent =
		x[slideIndex[projectId] - 1].dataset.title
}
