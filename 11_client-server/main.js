(() => {
  const studentsList = [];
  // student's ids to delete:
  const markedStudentIdList = [];
  let idForGen = 0;

  // const student = {
  //   studentName: nameField.value.trim(),
  //   surname: surnameField.value.trim(),
  //   middleName: middleNameField.value.trim(),
  //   birthDate: birthday,
  //   startEducationDate: startEducation,
  //   direction: directionField.value.trim(),
  //   id: id,
  // };

  // ---------------------------------------Calculate age function----------------------------------
  function getAge(birthday) {
    const today = new Date();
    let years = today.getFullYear() - birthday.getFullYear();
    const currentBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
    years = currentBirthday > today ? --years : years;
    return years;
  }

  // ---------------------------------------Calculate student course function-----------------------
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

  // ---------------------------------------Add student item in table-------------------------------
  function getStudentItem(studentObj) {
    const studentTbl = document.getElementById('studentTableBody');
    const tblRow = document.createElement('tr');

    const studentNameInTbl = document.createElement('td');
    const studentNameBtnInTbl = document.createElement('button');
    const btnId = `getStudentBtn + ${studentObj.id}`;
    studentNameBtnInTbl.setAttribute('id', btnId);
    studentNameBtnInTbl.setAttribute('type', 'button');
    studentNameBtnInTbl.classList.add('btn', 'btn-link', 'text-secondary', 'p-0', 'font-weight-bold');
    studentNameBtnInTbl.textContent = `${studentObj.surname} ${studentObj.studentName} ${studentObj.middleName}`;
    studentNameInTbl.append(studentNameBtnInTbl);

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

    // ------------------------------------Mark student to delete-----------------------------------
    // const getStudentBtn = document.getElementById(btnId);
    const deleteStudentBtn = document.getElementById('deleteStudentBtn');
    studentNameBtnInTbl.addEventListener('click', () => {
      // add or remove id from markedStudentIdList (array to delete)
      if (studentNameBtnInTbl.classList.contains('text-secondary')) {
        markedStudentIdList.push(studentObj.id);
        deleteStudentBtn.disabled = false;
      } else {
        const index = markedStudentIdList.indexOf(studentObj.id);
        if (index !== -1) {
          markedStudentIdList.splice(index, 1);
        }
        if (markedStudentIdList.length === 0) {
          deleteStudentBtn.disabled = true;
        }
      }

      tblRow.classList.toggle('bg-secondary');
      tblRow.classList.toggle('text-light');
      studentNameBtnInTbl.classList.toggle('text-secondary');
      studentNameBtnInTbl.classList.toggle('text-light');
    });
  }

  // ---------------------------------------Add all students item in table--------------------------
  function renderStudentsTable(studentsArray) {
    const studentTbl = document.getElementById('studentTableBody');
    const deleteStudentBtn = document.getElementById('deleteStudentBtn');
    while (studentTbl.firstChild) {
      studentTbl.removeChild(studentTbl.firstChild);
    }
    studentsArray.forEach((element) => {
      getStudentItem(element);
    });
    markedStudentIdList.splice(0, markedStudentIdList.length);
    deleteStudentBtn.disabled = true;
  }

  // ---------------------------------------Sort functions------------------------------------------
  function sortStudentTableBy(studentsArray, prop) {
    const sortedArray = [...studentsArray];
    sortedArray.sort((student1, student2) => {
      if (student1[prop] < student2[prop]) {
        return -1;
      }
      return 1;
    });
    return sortedArray;
  }

  function sortStudentTableByName(studentsArray) {
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
    return sortedArray;
  }

  // ---------------------------------------Filter functions----------------------------------------
  function filterStudentTableByName(studentsArray, value) {
    let filteredArray = [...studentsArray];
    filteredArray.forEach((student) => {
      student.strToFilter = `${student.surname} ${student.studentName} ${student.middleName}`;
    });
    filteredArray = filteredArray.filter((student) => student.strToFilter.includes(value));
    return filteredArray;
  }

  function filterStudentTableByDirection(studentsArray, value) {
    const filteredArr = studentsArray.filter((student) => student.direction.includes(value));
    return filteredArr;
  }

  function filterStudentTableByStartEducation(studentsArray, value) {
    const startEducation = new Date(value, 8, 1);
    const filteredArray = studentsArray.filter((student) => {
      const retVal = student.startEducationDate.getTime() === startEducation.getTime();
      return retVal;
    });
    return filteredArray;
  }

  function filterStudentTableByEndEducation(studentsArray, value) {
    const filteredArray = studentsArray.filter((student) => {
      const EndEducationYear = student.startEducationDate.getFullYear() + 4;
      return EndEducationYear === parseInt(value, 10);
    });
    return filteredArray;
  }

  // ---------------------------------------Add new student function--------------------------------
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
      id: idForGen++,
    };

    studentsList.push(student);
    return null;
  }

  // ---------------------------------------Initialize function-------------------------------------
  function addListneners() {
    const hint = document.getElementById('studentHint');
    const inputStudentForm = document.getElementById('inputStudentForm');

    // ---------------------------------------Add---------------------------------------
    inputStudentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const retStr = addStudentObject();
      if (retStr !== null) {
        hint.textContent = retStr;
        hint.classList.remove('invisible');
      } else {
        getStudentItem(studentsList[studentsList.length - 1], studentsList.length - 1);
        hint.textContent = 'Студент добавлен';
        hint.classList.remove('invisible');
        setTimeout(() => {
          hint.classList.add('invisible');
        }, 3000);
      }
    });

    // ---------------------------------------Sort---------------------------------------
    const directionBtn = document.getElementById('directionBtn');
    directionBtn.addEventListener('click', () => {
      renderStudentsTable(sortStudentTableBy(studentsList, 'direction'));
    });

    const birthdayBtn = document.getElementById('birthdayBtn');
    birthdayBtn.addEventListener('click', () => {
      renderStudentsTable(sortStudentTableBy(studentsList, 'birthDate'));
    });

    const startEducationBtn = document.getElementById('startEducationBtn');
    startEducationBtn.addEventListener('click', () => {
      renderStudentsTable(sortStudentTableBy(studentsList, 'startEducationDate'));
    });

    const nameBtn = document.getElementById('nameBtn');
    nameBtn.addEventListener('click', () => {
      renderStudentsTable(sortStudentTableByName(studentsList));
    });

    // ---------------------------------------Filter---------------------------------------
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
          renderStudentsTable(filterStudentTableByDirection(studentsList, filter));
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
          renderStudentsTable(filterStudentTableByStartEducation(studentsList, filter));
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
          renderStudentsTable(filterStudentTableByEndEducation(studentsList, filter));
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
        filteredArray = filterStudentTableByDirection(filteredArray, directionFilter);
      }

      const startEducationFilter = inputStartEducationFilter.value.trim();
      if (startEducationFilter) {
        filteredArray = filterStudentTableByStartEducation(filteredArray, startEducationFilter);
      }

      const endEducationFilter = inputEndEducationFilter.value.trim();
      if (endEducationFilter) {
        filteredArray = filterStudentTableByEndEducation(filteredArray, endEducationFilter);
      }

      renderStudentsTable(filteredArray);
    });

    filterForm.addEventListener('reset', () => {
      setFilterBtn.disabled = true;
      clearFilterBtn.disabled = true;
      renderStudentsTable(studentsList);
    });
  }

  // ---------------------------------------Remove student------------------------------------------
  const deleteStudentBtn = document.getElementById('deleteStudentBtn');
  deleteStudentBtn.addEventListener('click', () => {
    markedStudentIdList.forEach((id) => {
      const studendIndexToDele = studentsList.findIndex((student) => student.id === id);
      studentsList.splice(studendIndexToDele, 1);
    });
    renderStudentsTable(studentsList);
  });

  document.addEventListener('DOMContentLoader', addListneners());
})();
