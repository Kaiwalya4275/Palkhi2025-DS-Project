function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    console.error(`Section "${sectionId}" not found`);
  }
}
