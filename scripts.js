const nameScreen = document.getElementById("name-screen");
const app = document.getElementById("app");

const nameInput = document.getElementById("nameInput");
const saveNameBtn = document.getElementById("saveNameBtn");



const welcomeText = document.getElementById("welcomeText");

const titleInput = document.getElementById("titleInput");
const descriptionInput = document.getElementById("descriptionInput");
const idealDateInput = document.getElementById("idealDateInput");

const addBtn = document.getElementById("addBtn");

const list = document.getElementById("list");

const sortSelect = document.getElementById("sortSelect");

const openModalBtn =
document.getElementById("openModalBtn");

const closeModalBtn =
document.getElementById("closeModalBtn");

const modalOverlay =
document.getElementById("modalOverlay");

const imageInput =
document.getElementById("imageInput");

let currentUser =
localStorage.getItem("bucketUser");

/* INIT */

function init(){

  if(currentUser){

    showApp();

  }else{

    nameScreen.style.display = "flex";

    app.style.display = "none";

  }

  loadItems();

  startHearts();
}

/* SHOW APP */

function showApp(){

  nameScreen.style.display = "none";

  app.style.display = "block";

  welcomeText.innerText =
  `welcome back, ${currentUser}`;

}

/* SAVE NAME */

saveNameBtn.addEventListener("click", () => {

  const name =
  nameInput.value.trim();

  if(!name){

    alert("enter your name");

    return;
  }

  localStorage.setItem("bucketUser", name);

  currentUser = name;

  showApp();

});


/* OPEN MODAL */

openModalBtn.addEventListener("click", () => {

  modalOverlay.classList.remove("hidden");

});

/* CLOSE MODAL */

closeModalBtn.addEventListener("click", () => {

  modalOverlay.classList.add("hidden");

  clearModal();

});

/* CLEAR MODAL */

function clearModal(){

  titleInput.value = "";

  descriptionInput.value = "";

  idealDateInput.value = "";

  imageInput.value = "";

}

/* ADD ITEM */

addBtn.addEventListener("click", async () => {

  const title =
  titleInput.value.trim();

  const description =
  descriptionInput.value.trim();

  const idealDate =
  idealDateInput.value.trim();

  if(!title){

    alert("enter a title");

    return;
  }

  let imageUrl = "";

  /* IMAGE PREVIEW STORAGE */

  if(imageInput.files[0]){

    imageUrl =
    URL.createObjectURL(imageInput.files[0]);

  }

  try{

    await db.collection("bucketItems").add({

      title:title,

      description:description,

      idealDate:idealDate,

      image:imageUrl,

      addedBy:currentUser,

      completed:false,

      createdAt:
      firebase.firestore.FieldValue.serverTimestamp()

    });

    loadItems();

    modalOverlay.classList.add("hidden");

    clearModal();

  }catch(err){

    console.log(err);

  }

});

/* SORT */

sortSelect.addEventListener("change", loadItems);

/* LOAD ITEMS */

async function loadItems(){

  try{

    list.innerHTML = "loading...";

    const snapshot =
    await db.collection("bucketItems").get();

    let items = [];

    snapshot.forEach(doc => {

      items.push({
        id:doc.id,
        ...doc.data()
      });

    });

    if(sortSelect.value === "newest"){

      items.sort((a,b) =>
        (b.createdAt?.seconds || 0) -
        (a.createdAt?.seconds || 0)
      );

    }else{

      items.sort((a,b) =>
        (a.createdAt?.seconds || 0) -
        (b.createdAt?.seconds || 0)
      );

    }

    renderItems(items);

  }catch(err){

    console.log(err);

  }

}

/* RENDER ITEMS */

function renderItems(items){

  list.innerHTML = "";

  if(items.length === 0){

    list.innerHTML = `
      <p style="opacity:.6;text-align:center;">
        ADD STUFF WE HAVE TO DO SOMETHINGG VRO
      </p>
    `;

    return;
  }

  items.forEach(item => {

    const card =
    document.createElement("div");

    card.className =
    `card ${item.completed ? "completed" : ""}`;

    card.innerHTML = `

      <h3>${item.title}</h3>

      <p>
        ${item.description || "no description"}
      </p>

      ${
        item.image
        ?
        `
        <img
          src="${item.image}"
          alt="memory image"
        >
        `
        :
        ""
      }

      <small>
        ideal date:
        ${item.idealDate || "not set"}
      </small>

      <small>
        added by:
        ${item.addedBy}
      </small>

      <div class="card-buttons">

        ${
          !item.completed
          ?
          `
          <button class="complete-btn">
            complete
          </button>
          `
          :
          ""
        }

        <button class="delete-btn">
          delete
        </button>

      </div>

    `;

    /* DELETE */

    const deleteBtn =
    card.querySelector(".delete-btn");

    deleteBtn.addEventListener("click",
    async () => {

      const yes =
      confirm("delete this item?");

      if(!yes) return;

      await db.collection("bucketItems")
      .doc(item.id)
      .delete();

      loadItems();

    });

    /* COMPLETE */

    const completeBtn =
    card.querySelector(".complete-btn");

    if(completeBtn){

      completeBtn.addEventListener("click",
      async () => {

        await db.collection("bucketItems")
        .doc(item.id)
        .update({
          completed:true
        });

        loadItems();

      });

    }

    list.appendChild(card);

  });

}

/* HEARTS */

function startHearts(){

  setInterval(() => {

    const heart =
    document.createElement("div");

    heart.className = "heart";

  heart.innerText = "♥";

    heart.style.left =
    Math.random() * innerWidth + "px";

    heart.style.fontSize =
(24 + Math.random() * 26) + "px";
heart.style.animationDuration =
(12 + Math.random() * 10) + "s";

    document.body.appendChild(heart);

    setTimeout(() => {

      heart.remove();

    },10000);

  },700);

}

init();