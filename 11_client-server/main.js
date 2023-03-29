(() => {
  // student's ids to delete:
  const markedStudentIdList = [];

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
    const btnId = `getStudentBtn${studentObj.id}`;
    studentNameBtnInTbl.setAttribute('id', btnId);
    studentNameBtnInTbl.setAttribute('type', 'button');
    studentNameBtnInTbl.classList.add('btn', 'btn-link', 'text-secondary', 'p-0', 'font-weight-bold');
    studentNameBtnInTbl.textContent = `${studentObj.surname} ${studentObj.name} ${studentObj.lastname}`;
    studentNameInTbl.append(studentNameBtnInTbl);

    const directionInTbl = document.createElement('td');
    directionInTbl.textContent = studentObj.faculty;
    const birthDate = new Date(studentObj.birthday);
    const age = getAge(birthDate);
    const birthdayInTbl = document.createElement('td');
    birthdayInTbl.textContent = `${birthDate.toLocaleDateString()} (${age} лет)`;
    const educationYearsInTbl = document.createElement('td');
    const studyStartDate = new Date(studentObj.studyStart);
    educationYearsInTbl.textContent = getEducationYearsStr(studyStartDate);

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

  async function getStudentsArray() {
    const response = await fetch('http://localhost:3000/api/students');
    const retVal = await response.json();
    return retVal;
  }

  // ---------------------------------------Add all students item in table--------------------------
  async function renderStudentsTable(studentsArray = null) {
    let mainArray = [];
    if (studentsArray === null) {
      // const response = await fetch('http://localhost:3000/api/students');
      // mainArray = await response.json();
      mainArray = await getStudentsArray();
    } else {
      mainArray = [...studentsArray];
    }
    const studentTbl = document.getElementById('studentTableBody');
    const deleteStudentBtn = document.getElementById('deleteStudentBtn');
    while (studentTbl.firstChild) {
      studentTbl.removeChild(studentTbl.firstChild);
    }
    mainArray.forEach((element) => {
      getStudentItem(element);
    });
    markedStudentIdList.splice(0, markedStudentIdList.length);
    deleteStudentBtn.disabled = true;
  }

  // ---------------------------------------Sort functions------------------------------------------
  async function sortStudentTableBy(prop) {
    // const response = await fetch('http://localhost:3000/api/students');
    // const sortedArray = await response.json();
    const sortedArray = await getStudentsArray();
    sortedArray.sort((student1, student2) => {
      if (student1[prop] < student2[prop]) {
        return -1;
      }
      return 1;
    });
    return sortedArray;
  }

  async function sortStudentTableByDay(prop) {
    // const response = await fetch('http://localhost:3000/api/students');
    // const sortedArray = await response.json();
    const sortedArray = await getStudentsArray();
    sortedArray.sort((student1, student2) => {
      const birthday1 = new Date(student1[prop]);
      const birthday2 = new Date(student2[prop]);
      if (birthday1 < birthday2) {
        return -1;
      }
      return 1;
    });
    return sortedArray;
  }

  async function sortStudentTableByName() {
    // const response = await fetch('http://localhost:3000/api/students');
    // const sortedArray = await response.json();
    const sortedArray = await getStudentsArray();
    sortedArray.forEach((student) => {
      student.strToSort = `${student.surname} ${student.name} ${student.lastname}`;
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
  async function filterStudentTableByName(value, studentsArray = null) {
    let filteredArray;
    if (studentsArray) {
      filteredArray = [...studentsArray];
    } else {
      // const response = await fetch('http://localhost:3000/api/students');
      // filteredArray = await response.json();
      filteredArray = await getStudentsArray();
    }

    filteredArray.forEach((student) => {
      student.strToFilter = `${student.surname} ${student.name} ${student.lastname}`;
    });
    filteredArray = filteredArray.filter((student) => student.strToFilter.includes(value));
    return filteredArray;
  }

  async function filterStudentTableByDirection(value, studentsArray = null) {
    let filteredArray;
    if (studentsArray) {
      filteredArray = [...studentsArray];
    } else {
      // const response = await fetch('http://localhost:3000/api/students');
      // filteredArray = await response.json();
      filteredArray = await getStudentsArray();
    }

    filteredArray = filteredArray.filter((student) => student.faculty.includes(value));
    return filteredArray;
  }

  async function filterStudentTableByStartEducation(value, studentsArray = null) {
    let filteredArray;
    if (studentsArray) {
      filteredArray = [...studentsArray];
    } else {
      // const response = await fetch('http://localhost:3000/api/students');
      // filteredArray = await response.json();
      filteredArray = await getStudentsArray();
    }

    const startEducation = new Date(value, 8, 1);
    filteredArray = filteredArray.filter((student) => {
      student.studyStart = new Date(student.studyStart);
      const retVal = student.studyStart.getTime() === startEducation.getTime();
      return retVal;
    });
    return filteredArray;
  }

  async function filterStudentTableByEndEducation(value, studentsArray = null) {
    let filteredArray;
    if (studentsArray) {
      filteredArray = [...studentsArray];
    } else {
      // const response = await fetch('http://localhost:3000/api/students');
      // filteredArray = await response.json();
      filteredArray = await getStudentsArray();
    }

    filteredArray = filteredArray.filter((student) => {
      student.studyStart = new Date(student.studyStart);
      const EndEducationYear = student.studyStart.getFullYear() + 4;
      return EndEducationYear === parseInt(value, 10);
    });
    return filteredArray;
  }

  // ---------------------------------------Add new student function--------------------------------
  async function addStudentObject() {
    const nameField = document.getElementById('studentName');
    const surnameField = document.getElementById('studentSurname');
    const middleNameField = document.getElementById('studentMiddleName');
    const birthdayDateField = document.getElementById('studentBirthday');
    const startYearField = document.getElementById('startEducation');
    const directionField = document.getElementById('direction');
    const birthdate = birthdayDateField.valueAsDate;
    const startEducation = new Date(startYearField.value, 8, 1);
    let retVal = null;
    let errString = null;
    if (nameField.value.trim().length === 0) {
      errString = 'Введите имя студента';
    } else if (surnameField.value.trim().length === 0) {
      errString = 'Введите фамилию студента';
    } else if (middleNameField.value.trim().length === 0) {
      errString = 'Введите отчество студента';
    } else if (directionField.value.trim().length === 0) {
      errString = 'Введите факультет обучения';
    } else if ((birthdate < new Date(1900, 0, 1)) || (birthdate > Date.now())) {
      errString = 'Неверная дата рождения';
    } else if ((startEducation < new Date(2000, 0, 1)) || (startEducation > Date.now())) {
      errString = 'Неверная дата начала обучения';
    } else {
      const response = await fetch('http://localhost:3000/api/students', {
        method: 'POST',
        body: JSON.stringify({
          name: nameField.value.trim(),
          surname: surnameField.value.trim(),
          lastname: middleNameField.value.trim(),
          birthday: birthdate.toJSON(),
          studyStart: startEducation.toJSON(),
          faculty: directionField.value.trim(),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      retVal = await response.json();
    }

    return {
      retVal,
      errString,
    };
  }

  // ---------------------------------------Initialize function-------------------------------------
  function addListneners() {
    renderStudentsTable();
    const hint = document.getElementById('studentHint');
    const inputStudentForm = document.getElementById('inputStudentForm');

    // ---------------------------------------Add---------------------------------------
    inputStudentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const retObj = await addStudentObject();
      if (retObj.errString !== null) {
        hint.textContent = retObj.errString;
        hint.classList.remove('invisible');
      } else {
        getStudentItem(retObj.retVal);
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
      sortStudentTableBy('faculty').then((sortedArray) => {
        renderStudentsTable(sortedArray);
      });
    });

    const birthdayBtn = document.getElementById('birthdayBtn');
    birthdayBtn.addEventListener('click', () => {
      sortStudentTableByDay('birthday').then((sortedArray) => {
        renderStudentsTable(sortedArray);
      });
    });

    const startEducationBtn = document.getElementById('startEducationBtn');
    startEducationBtn.addEventListener('click', () => {
      sortStudentTableByDay('studyStart').then((sortedArray) => {
        renderStudentsTable(sortedArray);
      });
    });

    const nameBtn = document.getElementById('nameBtn');
    nameBtn.addEventListener('click', () => {
      sortStudentTableByName().then((sortedArray) => {
        renderStudentsTable(sortedArray);
      });
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
          filterStudentTableByName(filter).then((filteredArray) => {
            renderStudentsTable(filteredArray);
          });
        } else {
          renderStudentsTable();
        }
      }, 3000);
    });

    inputDirectionFilter.addEventListener('input', () => {
      setTimeout(() => {
        setFilterBtn.disabled = false;
        clearFilterBtn.disabled = false;
        const filter = inputDirectionFilter.value.trim();
        if (filter) {
          filterStudentTableByDirection(filter).then((filteredArray) => {
            renderStudentsTable(filteredArray);
          });
        } else {
          renderStudentsTable();
        }
      }, 3000);
    });

    inputStartEducationFilter.addEventListener('input', () => {
      setTimeout(() => {
        setFilterBtn.disabled = false;
        clearFilterBtn.disabled = false;
        const filter = inputStartEducationFilter.value.trim();
        if (filter) {
          filterStudentTableByStartEducation(filter).then((filteredArray) => {
            renderStudentsTable(filteredArray);
          });
        } else {
          renderStudentsTable();
        }
      }, 3000);
    });

    inputEndEducationFilter.addEventListener('input', () => {
      setTimeout(() => {
        setFilterBtn.disabled = false;
        clearFilterBtn.disabled = false;
        const filter = inputEndEducationFilter.value.trim();
        if (filter) {
          filterStudentTableByEndEducation(filter).then((filteredArray) => {
            renderStudentsTable(filteredArray);
          });
        } else {
          renderStudentsTable();
        }
      }, 3000);
    });

    filterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let filteredArray;

      const nameFilter = inputNameFilter.value.trim();
      if (nameFilter) {
        filteredArray = await filterStudentTableByName(nameFilter, filteredArray);
      }

      const directionFilter = inputDirectionFilter.value.trim();
      if (directionFilter) {
        filteredArray = await filterStudentTableByDirection(directionFilter, filteredArray);
      }

      const startEducationFilter = inputStartEducationFilter.value.trim();
      if (startEducationFilter) {
        filteredArray = await filterStudentTableByStartEducation(
          startEducationFilter,
          filteredArray,
        );
      }

      const endEducationFilter = inputEndEducationFilter.value.trim();
      if (endEducationFilter) {
        filteredArray = await filterStudentTableByEndEducation(endEducationFilter, filteredArray);
      }

      renderStudentsTable(filteredArray);
    });

    filterForm.addEventListener('reset', async () => {
      setFilterBtn.disabled = true;
      clearFilterBtn.disabled = true;
      await renderStudentsTable();
    });
  }

  // ---------------------------------------Remove student------------------------------------------
  const deleteStudentBtn = document.getElementById('deleteStudentBtn');
  deleteStudentBtn.addEventListener('click', () => {
    let count = markedStudentIdList.length;
    markedStudentIdList.forEach(async (id) => {
      await fetch(`http://localhost:3000/api/students/${id}`, {
        method: 'DELETE',
      }).then(() => {
        if (--count === 0) {
          renderStudentsTable();
        }
      });
    });
  });

  document.addEventListener('DOMContentLoader', addListneners());
})();
