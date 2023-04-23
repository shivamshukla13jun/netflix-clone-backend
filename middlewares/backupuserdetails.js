const UserDataPath=path.join(__dirname,'user_data.json')
const CreateuserDetails = async (req, res, message, type) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { country, city, region } = await axios.get(`http://ip-api.com/json/${ip}`).then(response => response.data);
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    const useragent = req.headers['user-agent'];
    const userRawData = {
      ip,
      date: d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear(),
      time: d.toLocaleTimeString(),
      page: req.url,
      query: req.query || req.query || "",
      inputQuery: req.body || "",
      type,
      country: country || "",
      city: city || "",
      region: region || "",
      useragent,
      latitude: "",
      longitude: "",
      domain: req.get('host'),
      bot: type === "isBot" ? true : false,
      referurl: req.protocol + '://' + req.get('host') + req.originalUrl || ""
    };
    const userData = JSON.parse(fs.readFileSync(UserDataPath));
    const filter = { ip };
    const index = userData.findIndex(user => user.ip === ip);
    if (index >= 0) {
      userData[index] = userRawData;
      fs.writeFileSync(UserDataPath, JSON.stringify(userData));
      errorHandler(res, 406, message)
    // } else {
      userData.push(userRawData);
      fs.writeFileSync(UserDataPath, JSON.stringify(userData));
      errorHandler(res, 406, message);
    }
  } catch (error) {
    console.error(error);
    }
    };