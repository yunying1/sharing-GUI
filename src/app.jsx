import { useRef, useState } from "react";
import QRCode from "qrcode/lib/browser";
import { useTranslation, Trans } from "react-i18next";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import "./app.css";
import Header from "./Components/Header";
import Input from "./Components/Input";
import Radio from "./Components/Radio";
import Button from "./Components/Button";
import Tips from "./Components/Tips";
import Checkbox from "./Components/Checkbox";
import Authtoken from "./Components/Authtoken";
import HelpIcon from "./Components/HelpIcon";

const SHARE_TYPE = {
  SHARE: 0,
  CLIPBORAD: 1,
  RECEIVE: 2,
};

const App = () => {
  const { t } = useTranslation();
  const [qrcodeImg, setQrcodeImg] = useState("");
  const [shareType, setShareType] = useState(SHARE_TYPE.SHARE);
  const [sharePathList, setSharePathList] = useState([]);
  const [receivePath, setReceivePath] = useState("");
  const [port, setPort] = useState("");
  const [publicIP, setPublicIP] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [serviceUrl, setServiceUrl] = useState("");
  const [isShowCopyTips, setIsShowCopyTips] = useState(false);
  const [isShowAuthtokenTips, setIsShowAuthtokenTips] = useState(false);
  const [isStaring, setIsStaring] = useState(false);
  const [isDragEnter, setIsDragEnter] = useState(false);
  const [ngrok, setNgrok] = useState(false);
  const [manageAuthtoken, setManageAuthtoken] = useState(false);
  const countRef = useRef(0);

  /**
   * @desc start service
   */
  const onStartServiceHandle = () => {
    if (shareType !== SHARE_TYPE.CLIPBORAD) {
      if (shareType === SHARE_TYPE.SHARE && sharePathList.length <= 0) {
        alert(t("Select at least one directory or file"));
        return;
      }
      if (shareType === SHARE_TYPE.RECEIVE && !receivePath) {
        alert(t("Please select a directory!"));
        return;
      }
    }
    setIsStaring(true);

    const pathList =
      shareType === SHARE_TYPE.SHARE ? sharePathList : [receivePath];
    let params = {
      pathList,
      port,
      publicIP,
      username,
      password,
    };
    if (ngrok) {
      const authtoken = localStorage.getItem("authtoken");
      if (!authtoken) {
        setIsShowAuthtokenTips(true);
        setTimeout(() => {
          setIsShowAuthtokenTips(false);
        }, 2000);
        setIsStaring(false);
        setManageAuthtoken(true);
        return;
      }
      params.ngrok = authtoken;
    }
    window.electronAPI.emit("sharing", { type: shareType, params }).then(
      (res) => {
        if (res.success) {
          setIsStaring(false);
          setIsStarted(true);
          setServiceUrl(res.url);
          QRCode.toDataURL(res.url).then((res) => {
            setQrcodeImg(res);
          });
        } else {
          alert(res.msg);
          setIsStaring(false);
        }
      },
      (err) => {
        alert(err);
        setIsStaring(false);
      }
    );
  };

  /**
   * @desc end service
   */
  const onEndServiceHandle = () => {
    window.electronAPI.emit("end-sharing").then((res) => {
      setIsStarted(false);
    });
  };

  /**
   * @desc radio click event
   * @param {Number} shareType
   */
  const onRadioClickHandle = (shareType) => {
    setShareType(shareType);
  };

  /**
   * @desc select share directories or files
   */
  const onSelectSharePath = () => {
    window.electronAPI.emit("select-path").then((res) => {
      if (res.canceled) return;
      // console.log("select dir:", res.filePaths);
      if (res?.filePaths && res.filePaths.length > 0) {
        const filePaths = res.filePaths[0];
        setSharePathList([...sharePathList, filePaths]);
      }
    });
  };

  /**
   * @desc select receive directory
   */
  const onSelectReceiveDirectory = () => {
    window.electronAPI.emit("select-path", null, true).then((res) => {
      if (res.canceled) return;
      // console.log("select dir:", res.filePaths);
      if (res?.filePaths && res.filePaths.length > 0) {
        const filePaths = res.filePaths[0];
        setReceivePath(filePaths);
      }
    });
  };

  /**
   * @desc Remove path from the path list.
   * @param {String} path
   */
  const removePath = (path) => {
    const _sharePathList = sharePathList.filter(
      (pathItem) => pathItem !== path
    );
    setSharePathList(_sharePathList);
  };

  /**
   * @desc change default port
   */
  const onPortChange = (e) => {
    const port = e.target.value;
    setPort(port);
  };

  /**
   * @desc change public IP
   */
  const onpublicIPChange = (e) => {
    const publicIP = e.target.value;
    setPublicIP(publicIP);
  };

  /**
   * @desc change username
   */
  const onUsernameChange = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  /**
   * @desc change password
   */
  const onPasswordChange = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const ClipIcon = (props) => {
    return (
      <div className="clip-icon" {...props}>
        <svg
          width="10"
          height="14"
          viewBox="0 0 10 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.625 8.18182H3.125C2.95924 8.18182 2.80027 8.25365 2.68306 8.38152C2.56585 8.50938 2.5 8.68281 2.5 8.86364C2.5 9.04447 2.56585 9.21789 2.68306 9.34575C2.80027 9.47362 2.95924 9.54545 3.125 9.54545H5.625C5.79076 9.54545 5.94973 9.47362 6.06694 9.34575C6.18415 9.21789 6.25 9.04447 6.25 8.86364C6.25 8.68281 6.18415 8.50938 6.06694 8.38152C5.94973 8.25365 5.79076 8.18182 5.625 8.18182ZM8.125 1.36364H7.3875C7.25855 0.965762 7.01996 0.621135 6.70442 0.377003C6.38888 0.132872 6.01184 0.00118603 5.625 0H4.375C3.98816 0.00118603 3.61112 0.132872 3.29558 0.377003C2.98004 0.621135 2.74145 0.965762 2.6125 1.36364H1.875C1.37772 1.36364 0.900806 1.57914 0.549175 1.96274C0.197544 2.34633 0 2.8666 0 3.40909V11.5909C0 12.1334 0.197544 12.6537 0.549175 13.0373C0.900806 13.4209 1.37772 13.6364 1.875 13.6364H8.125C8.62228 13.6364 9.09919 13.4209 9.45083 13.0373C9.80246 12.6537 10 12.1334 10 11.5909V3.40909C10 2.8666 9.80246 2.34633 9.45083 1.96274C9.09919 1.57914 8.62228 1.36364 8.125 1.36364V1.36364ZM3.75 2.04545C3.75 1.86463 3.81585 1.6912 3.93306 1.56334C4.05027 1.43547 4.20924 1.36364 4.375 1.36364H5.625C5.79076 1.36364 5.94973 1.43547 6.06694 1.56334C6.18415 1.6912 6.25 1.86463 6.25 2.04545V2.72727H3.75V2.04545ZM8.75 11.5909C8.75 11.7717 8.68415 11.9452 8.56694 12.073C8.44973 12.2009 8.29076 12.2727 8.125 12.2727H1.875C1.70924 12.2727 1.55027 12.2009 1.43306 12.073C1.31585 11.9452 1.25 11.7717 1.25 11.5909V3.40909C1.25 3.22826 1.31585 3.05484 1.43306 2.92697C1.55027 2.79911 1.70924 2.72727 1.875 2.72727H2.5V3.40909C2.5 3.58992 2.56585 3.76334 2.68306 3.89121C2.80027 4.01907 2.95924 4.09091 3.125 4.09091H6.875C7.04076 4.09091 7.19973 4.01907 7.31694 3.89121C7.43415 3.76334 7.5 3.58992 7.5 3.40909V2.72727H8.125C8.29076 2.72727 8.44973 2.79911 8.56694 2.92697C8.68415 3.05484 8.75 3.22826 8.75 3.40909V11.5909ZM6.875 5.45455H3.125C2.95924 5.45455 2.80027 5.52638 2.68306 5.65425C2.56585 5.78211 2.5 5.95553 2.5 6.13636C2.5 6.31719 2.56585 6.49062 2.68306 6.61848C2.80027 6.74635 2.95924 6.81818 3.125 6.81818H6.875C7.04076 6.81818 7.19973 6.74635 7.31694 6.61848C7.43415 6.49062 7.5 6.31719 7.5 6.13636C7.5 5.95553 7.43415 5.78211 7.31694 5.65425C7.19973 5.52638 7.04076 5.45455 6.875 5.45455Z"
            fill="#16A34A"
          />
        </svg>
      </div>
    );
  };

  /**
   * @desc copy service url
   */
  const onCopyUrlHandle = () => {
    window.electronAPI.emit("copy", serviceUrl);
    setIsShowCopyTips(true);
    setTimeout(() => {
      setIsShowCopyTips(false);
    }, 2000);
  };

  /**
   * @desc Drag enter handle
   */
  const onDragEnterHandle = (e) => {
    setIsDragEnter(true);
  };

  /**
   * @desc Drop handle
   */
  const onDropHandle = (e) => {
    setIsDragEnter(false);
    const files = e.dataTransfer.files;
    // console.log("e.dataTransfer.files", e.dataTransfer.files);
    if (files.length <= 0) return;

    if (shareType === SHARE_TYPE.SHARE) {
      let paths = [];
      for (let i = 0; i < files.length; i++) {
        const path = files[i]?.path;
        if (sharePathList.includes(path)) continue;
        paths.push(path);
      }
      setSharePathList([...sharePathList, ...paths]);
    }
    if (shareType === SHARE_TYPE.RECEIVE) {
      window.electronAPI
        .emit("path-to-dir-path", files[0]?.path)
        .then((dirPath) => {
          setReceivePath(dirPath);
        });
    }
  };

  /**
   * @desc Drag leave handle
   */
  const onDragLeaveHandle = (e) => {
    setIsDragEnter(false);
  };

  /**
   * @desc Drag events entry
   */
  const fileDrop = (e) => {
    if (shareType === SHARE_TYPE.CLIPBORAD || isStarted) return;
    if (e.type === "dragenter") {
      e.preventDefault();
      countRef.current++;
      if (countRef.current % 2) {
        onDragEnterHandle(e);
      }
    }
    if (e.type === "dragleave") {
      countRef.current++;
      if (!(countRef.current % 2)) {
        onDragLeaveHandle(e);
        countRef.current = 0;
      }
    }
    if (e.type === "dragover") {
      e.preventDefault();
    }
    if (e.type === "drop") {
      countRef.current = 0;
      onDropHandle(e);
    }
  };

  const onAuthtokenColse = () => {
    setManageAuthtoken(false);
  };

  /**
   * @desc click the use ngrok
   */
  const onClickNgrok = (checked) => {
    setNgrok(checked);
    if (checked && !localStorage.getItem("authtoken")) {
      setIsShowAuthtokenTips(true);
      setTimeout(() => setIsShowAuthtokenTips(false), 2000);
      setManageAuthtoken(true);
    }
  };

  return (
    <div
      className={`app ${isDragEnter ? "child-disable-event" : ""}`}
      onDragEnter={fileDrop}
      onDragLeave={fileDrop}
      onDragOver={fileDrop}
      onDrop={fileDrop}
    >
      <Header />
      {!isStarted && (
        <div className="content">
          {isShowAuthtokenTips && (
            <Tips title={t("An authtoken must be provided to use ngrok!")} />
          )}
          <div className="from-group">
            <div className="form-item">
              <Radio
                cehcked={shareType === SHARE_TYPE.SHARE}
                onClick={() => onRadioClickHandle(SHARE_TYPE.SHARE)}
              />
              <div>{t("Share Directories / Files")}</div>
            </div>
            {shareType === SHARE_TYPE.SHARE && (
              <>
                <div className="form-item form-item-item">
                  <div>
                    <span className="required-symbol">*</span>
                    {t("Directories / Files")}
                  </div>
                  {sharePathList.length > 0 &&
                    sharePathList.map((path) => (
                      <div key={path} className="path-item">
                        <p className="text-path">{path}</p>
                        <div
                          className="close-icon-box"
                          onClick={() => removePath(path)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            preserveAspectRatio="xMidYMid meet"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#ffffff"
                              d="m12 13.4l-4.9 4.9q-.275.275-.7.275q-.425 0-.7-.275q-.275-.275-.275-.7q0-.425.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7q0-.425.275-.7q.275-.275.7-.275q.425 0 .7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275q.425 0 .7.275q.275.275.275.7q0 .425-.275.7L13.4 12l4.9 4.9q.275.275.275.7q0 .425-.275.7q-.275.275-.7.275q-.425 0-.7-.275Z"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  <Button
                    className="btn"
                    size="small"
                    onClick={onSelectSharePath}
                  >
                    {t("Add")}
                  </Button>
                </div>
                <div className="form-item form-item-item">
                  <div>{t("Port")}</div>
                  <Input
                    className="input input-port"
                    placeholder={t("Optional")}
                    value={port}
                    onChange={onPortChange}
                  ></Input>
                </div>
              </>
            )}
            <div className="form-item">
              <Radio
                cehcked={shareType === SHARE_TYPE.CLIPBORAD}
                onClick={() => onRadioClickHandle(SHARE_TYPE.CLIPBORAD)}
              />
              <div>{t("Share Clipborad")}</div>
            </div>
            {shareType === SHARE_TYPE.CLIPBORAD && (
              <div className="form-item form-item-item">
                <div>{t("Port")}</div>
                <Input
                  className="input input-port"
                  placeholder={t("Optional")}
                  value={port}
                  onChange={onPortChange}
                ></Input>
              </div>
            )}
            <div className="form-item">
              <Radio
                cehcked={shareType === SHARE_TYPE.RECEIVE}
                onClick={() => onRadioClickHandle(SHARE_TYPE.RECEIVE)}
              />
              <div>{t("Receive files to directory")}</div>
            </div>
            {shareType === SHARE_TYPE.RECEIVE && (
              <>
                <div className="form-item form-item-item">
                  <div>
                    <span className="required-symbol">*</span>
                    {t("Directory")}
                  </div>
                  {receivePath && <p className="text-path">{receivePath}</p>}
                  <Button
                    className="btn"
                    size="small"
                    onClick={onSelectReceiveDirectory}
                  >
                    {receivePath ? t("Change") : t("Select")}
                  </Button>
                </div>
                <div className="form-item form-item-item">
                  <div>{t("Port")}</div>
                  <Input
                    className="input input-port"
                    placeholder={t("Optional")}
                    value={port}
                    onChange={onPortChange}
                  ></Input>
                </div>
              </>
            )}
          </div>
          <div className="from-group">
            <div className="form-item  form-many-item">
              <div
                className={`form-item-sub-item ${
                  ngrok ? "form-item-disable" : ""
                }`}
              >
                <label>{t("Public IP")}</label>
                <Input
                  className="input"
                  placeholder={`${t("Public IP")} (${t("Optional")})`}
                  onChange={onpublicIPChange}
                ></Input>
              </div>
              <div className="form-item-sub-item">
                <label>{t("Use ngrok")}</label>
                <div className="form-item-sub-item-checkbox">
                  <Checkbox defaultChecked={ngrok} onClick={onClickNgrok} />
                  <div
                    className="auth-token-btn"
                    onClick={() => setManageAuthtoken(true)}
                  >
                    {t("Manage Authtoken")}
                  </div>
                  <HelpIcon className="ngrok-help" />
                </div>
              </div>
            </div>
          </div>
          <div className="from-group">
            <div className="form-item form-many-item">
              <div className="form-item-sub-item">
                <label>{t("Username")}</label>
                <Input
                  className="input"
                  placeholder={t("Optional")}
                  onChange={onUsernameChange}
                ></Input>
              </div>
              <div className="form-item-sub-item">
                <label>{t("Password")}</label>
                <Input
                  className="input"
                  placeholder={t("Optional")}
                  onChange={onPasswordChange}
                ></Input>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}></div>
          <Button
            className="btn btn-start"
            onClick={onStartServiceHandle}
            isLoding={isStaring}
          >
            {t("Start Service")}
          </Button>
        </div>
      )}
      {isStarted && (
        <div className="result-content">
          {isShowCopyTips && <Tips title={t("Copied")} icon="check-mark" />}
          <img className="img-qrcode" src={qrcodeImg} />
          <Input
            className="input-result"
            value={serviceUrl}
            readOnly
            icon={<ClipIcon onClick={onCopyUrlHandle} />}
          />
          <Button className="btn-end" onClick={onEndServiceHandle}>
            {t("End Service")}
          </Button>
        </div>
      )}
      {isDragEnter && (
        <div className="drag-modal">
          <div className="drag-box">
            {shareType === SHARE_TYPE.SHARE
              ? t("Drag and drop directories / files to share")
              : t("Drag and drop directory to receive files")}
          </div>
        </div>
      )}
      {manageAuthtoken && <Authtoken onColse={onAuthtokenColse} />}
    </div>
  );
};

export default App;
