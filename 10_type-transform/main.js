(() => {
  const studentsList = [];

  // const student = {
  //   studentName: nameField.value.trim(),
  //   surname: surnameField.value.trim(),
  //   middleName: middleNameField.value.trim(),
  //   birthDate: birthday,
  //   startEducationDate: startEducation,
  //   direction: directionField.value.trim(),
  // };

  function getAge(birthday) {
    const today = new Date();
    let years = today.getFullYear() - birthday.getFullYear();
    const currentBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
    years = currentBirthday > today ? --years : years;
    return years;
  }

  function getEducationYearsStr(startEducation) {
    // const educationYears = getAge(startEducation);
    const today = new Date();
    let years = today.getFullYear() - startEducation.getFullYear();
    const st = new Date(today.getFullYear(), startEducation.getMonth(), startEducation.getDate());
    years = st > today ? years : years++;
    let educationYearsStr = `${startEducation.getFullYear()} - ${startEducation.getFullYear() + 4}`;
    if (years > 4) {
      educationYearsStr = `${educationYearsStr} (закончил)`;
    } else {
      educationYearsStr = `${educationYearsStr} (${years} курс)`;
    }
    return educationYearsStr;
  }

  function getStudentItem(studentObj) {
    const studentTbl = document.getElementById('studentTableBody');
    const tblRow = document.createElement('tr');

    const studentNameInTbl = document.createElement('td');
    studentNameInTbl.textContent = `${studentObj.surname} ${studentObj.studentName} ${studentObj.middleName}`;
    const directionInTbl = document.createElement('td');
    directionInTbl.textContent = studentObj.direction;
    const age = getAge(studentObj.birthDate);
    const birthdayInTbl = document.createElement('td');
    birthdayInTbl.textContent = `${studentObj.birthDate.toLocaleDateString()} (${age} лет)`;
    const educationYearsInTbl = document.createElement('td');
    educationYearsInTbl.textContent = getEducationYearsStr(studentObj.startEducationDate);

    tblRow.append(studentNameInTbl);
    tblRow.append(directionInTbl);
    tblRow.append(birthdayInTbl);
    tblRow.append(educationYearsInTbl);
    studentTbl.append(tblRow);
  }

  function renderStudentsTable(studentsArray) {
    const studentTbl = document.getElementById('studentTableBody');
    while (studentTbl.firstChild) {
      studentTbl.removeChild(studentTbl.firstChild);
    }
    studentsArray.forEach((element) => {
      getStudentItem(element);
    });
  }

  function sortStudentTableBy(studentsArray, prop) {
    const sortedArray = [...studentsArray];
    sortedArray.sort((student1, student2) => {
      if (student1[prop] < student2[prop]) {
        return -1;
      }
      return 1;
    });
    renderStudentsTable(sortedArray);
  }

  function sortStudentTableByName(studentsArray) {
    // studentsArray.forEach((studentObj) => {
    //   studentObj.direction = studentObj.direction.toUpperCase();
    // });
    const sortedArray = studentsArray.slice(0);
    sortedArray.forEach((student) => {
      student.strToSort = `${student.surname} ${student.studentName} ${student.middleName}`;
    });
    sortedArray.sort((student1, student2) => {
      if (student1.strToSort < student2.strToSort) {
        return -1;
      }
      return 1;
    });
    renderStudentsTable(sortedArray);
  }

  function filterStudentTableByName(studentsArray, value) {
    let filteredArray = [...studentsArray];
    filteredArray.forEach((student) => {
      student.strToFilter = `${student.surname} ${student.studentName} ${student.middleName}`;
    });
    filteredArray = filteredArray.filter((student) => student.strToFilter.includes(value));
    return filteredArray;
  }

  function addStudentObject() {
    const nameField = document.getElementById('studentName');
    const surnameField = document.getElementById('studentSurname');
    const middleNameField = document.getElementById('studentMiddleName');
    const birthdayDateField = document.getElementById('studentBirthday');
    const startYearField = document.getElementById('startEducation');
    const directionField = document.getElementById('direction');
    if (nameField.value.trim().length === 0) {
      return 'Введите имя студента';
    }
    if (surnameField.value.trim().length === 0) {
      return 'Введите фамилию студента';
    }
    if (middleNameField.value.trim().length === 0) {
      return 'Введите отчество студента';
    }
    if (directionField.value.trim().length === 0) {
      return 'Введите факультет обучения';
    }
    const birthday = birthdayDateField.valueAsDate;
    if ((birthday < new Date(1900, 0, 1)) || (birthday > Date.now())) {
      return 'Неверная дата рождения';
    }
    const startEducation = new Date(startYearField.value, 8, 1);
    if ((startEducation < new Date(2000, 0, 1)) || (startEducation > Date.now())) {
      return 'Неверная дата начала обучения';
    }

    const student = {
      studentName: nameField.value.trim(),
      surname: surnameField.value.trim(),
      middleName: middleNameField.value.trim(),
      birthDate: birthday,
      startEducationDate: startEducation,
      direction: directionField.value.trim(),
    };

    getStudentItem(student);
    studentsList.push(student);
    return null;
  }

  function addListneners() {
    const hint = document.getElementById('studentHint');
    const inputStudentForm = document.getElementById('inputStudentForm');

    inputStudentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const retStr = addStudentObject();
      if (retStr !== null) {
        hint.textContent = retStr;
        hint.classList.remove('invisible');
      } else {
        hint.textContent = 'Студент добавлен';
        hint.classList.remove('invisible');
        setTimeout(() => {
          hint.classList.add('invisible');
        }, 3000);
      }
    });

    const directionBtn = document.getElementById('directionBtn');
    directionBtn.addEventListener('click', () => {
      sortStudentTableBy(studentsList, 'direction');
    });

    const birthdayBtn = document.getElementById('birthdayBtn');
    birthdayBtn.addEventListener('click', () => {
      sortStudentTableBy(studentsList, 'birthDate');
    });

    const startEducationBtn = document.getElementById('startEducationBtn');
    startEducationBtn.addEventListener('click', () => {
      sortStudentTableBy(studentsList, 'startEducationDate');
    });

    const nameBtn = document.getElementById('nameBtn');
    nameBtn.addEventListener('click', () => {
      sortStudentTableByName(studentsList);
    });

    const inputNameFilter = document.getElementById('inputNameFilter');
    const inputDirectionFilter = document.getElementById('inputDirectionFilter');
    const inputStartEducationFilter = document.getElementById('inputStartEducationFilter');
    const inputEndEducationFilter = document.getElementById('inputEndEducationFilter');
    const setFilterBtn = document.getElementById('setFilterBtn');
    const clearFilterBtn = document.getElementById('clearFilterBtn');
    const filterForm = document.getElementById('filterForm');

    inputNameFilter.addEventListener('input', () => {
      setTimeout(() => {
        setFilterBtn.disabled = false;
        clearFilterBtn.disabled = false;
        const filter = inputNameFilter.value.trim();
        if (filter) {
          renderStudentsTable(filterStudentTableByName(studentsList, filter));
        } else {
          renderStudentsTable(studentsList);
        }
      }, 3000);
    });

    inputDirectionFilter.addEventListener('input', () => {
      setTimeout(() => {
        setFilterBtn.disabled = false;
        clearFilterBtn.disabled = false;
        const filter = inputDirectionFilter.value.trim();
        if (filter) {
          const filteredArr = studentsList.filter((student) => student.direction.includes(filter));
          renderStudentsTable(filteredArr);
        } else {
          renderStudentsTable(studentsList);
        }
      }, 3000);
    });

    inputStartEducationFilter.addEventListener('input', () => {
      setTimeout(() => {
        setFilterBtn.disabled = false;
        clearFilterBtn.disabled = false;
        const filter = inputStartEducationFilter.value.trim();
        if (filter) {
          const startEducation = new Date(filter, 8, 1);
          const filteredArray = studentsList.filter((student) => {
            const retVal = student.startEducationDate.getTime() === startEducation.getTime();
            return retVal;
          });
          renderStudentsTable(filteredArray);
        } else {
          renderStudentsTable(studentsList);
        }
      }, 3000);
    });

    inputEndEducationFilter.addEventListener('input', () => {
      setTimeout(() => {
        setFilterBtn.disabled = false;
        clearFilterBtn.disabled = false;
        const filter = inputEndEducationFilter.value.trim();
        if (filter) {
          const filteredArray = studentsList.filter((student) => {
            const EndEducationYear = student.startEducationDate.getFullYear() + 4;
            return EndEducationYear === parseInt(filter, 10);
          });
          renderStudentsTable(filteredArray);
        } else {
          renderStudentsTable(studentsList);
        }
      }, 3000);
    });

    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let filteredArray = [...studentsList];
      const nameFilter = inputNameFilter.value.trim();
      if (nameFilter) {
        filteredArray = filterStudentTableByName(filteredArray, nameFilter);
      }

      const directionFilter = inputDirectionFilter.value.trim();
      if (directionFilter) {
        filteredArray = filteredArray.filter((student) => {
          const retVal = student.direction.includes(directionFilter);
          return retVal;
        });
      }

      const startEducationFilter = inputStartEducationFilter.value.trim();
      if (startEducationFilter) {
        const startEducation = new Date(startEducationFilter, 8, 1);
        filteredArray = filteredArray.filter((student) => {
          const retVal = student.startEducationDate.getTime() === startEducation.getTime();
          return retVal;
        });
      }

      const endEducationFilter = inputEndEducationFilter.value.trim();
      if (endEducationFilter) {
        filteredArray = filteredArray.filter((student) => {
          const EndEducationYear = student.startEducationDate.getFullYear() + 4;
          return EndEducationYear === parseInt(endEducationFilter, 10);
        });
      }

      renderStudentsTable(filteredArray);
    });

    filterForm.addEventListener('reset', () => {
      // e.preventDefault();
      setFilterBtn.disabled = true;
      clearFilterBtn.disabled = true;
      renderStudentsTable(studentsList);
    });
  }

  document.addEventListener('DOMContentLoader', addListneners());
})();
