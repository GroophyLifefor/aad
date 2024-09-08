function getNewSettings() {
  const uuid = generateUUID();
  const prefix = prefixer('advanced-new-settings', uuid, 'component');

  addCustomCSS(`
    .${prefix('settingsCONTAINER')} {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .${prefix('heightTypeFieldSet')} {
      display: flex;
      width: 100%;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      transform: translateY(-18px);
    }

    .${prefix('heightTypeFieldSet')} input {
      opacity: 0;
    }

    .${prefix('heightTypeFieldSet')} label {
      cursor: pointer;
    }

    .${prefix('heightTypeFieldSet')} input:checked ~ label>.${prefix(
    'HeightTypeLayoutContainer'
  )} {
      border: 2px solid ${getColor('settings.border')};
      filter: brightness(1.5);
      box-shadow: rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset;
    }

    .${prefix('HeightTypeLayoutContainer')} {
      display: flex;
      gap: 6px;
      padding: 6px;
      border-radius: 20px;
      border: 1px solid ${getColor('settings.border')};
      width: 200px;
      height: 100px;
    }

    .${prefix('HeightTypeLayoutItemFirst')} {
      border-top-left-radius: 14px !important;
    }

    .${prefix('HeightTypeLayoutItem30InnerFirst')} {
      border-top-left-radius: 11.5px !important;
    }

    .${prefix('HeightTypeLayoutItem100InnerFirst')} {
      border-bottom-left-radius: 11.5px !important;
    }

    .${prefix('HeightTypeLayoutItemLast')} {
      border-top-right-radius: 14px !important;
    }

    .${prefix('HeightTypeLayoutItem30InnerLast')} {
      border-top-right-radius: 11.5px !important;
    }

    .${prefix('HeightTypeLayoutItem100InnerLast')} {
      border-bottom-right-radius: 11.5px !important;
    }

    .${prefix('HeightTypeLayoutItem30')} {
      width: 42.5px;
      height: 30px;
      border-radius: 6px;
      border: 1px solid ${getColor('settings.border')};
      padding: 2.5px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .${prefix('HeightTypeLayoutItem30Inner')} {
      width: 37.5px;
      height: 24px;
      border-radius: 3.5px;
      border: 1px solid ${getColor('settings.border')};
      background-color: ${getColor('modal.inset-bg')};
    }

    .${prefix('HeightTypeLayoutItem50')} {
      width: 42.5px;
      height: 50px;
      border-radius: 6px;
      border: 1px solid ${getColor('settings.border')};
      padding: 2.5px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .${prefix('HeightTypeLayoutItem50Inner')} {
      width: 37.5px;
      height: 44px;
      border-radius: 3.5px;
      border: 1px solid ${getColor('settings.border')};
      background-color: ${getColor('modal.inset-bg')};
    }

    .${prefix('HeightTypeLayoutItem60')} {
      width: 42.5px;
      height: 60px;
      border-radius: 6px;
      border: 1px solid ${getColor('settings.border')};
      padding: 2.5px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .${prefix('HeightTypeLayoutItem60Inner')} {
      width: 37.5px;
      height: 54px;
      border-radius: 3.5px;
      border: 1px solid ${getColor('settings.border')};
      background-color: ${getColor('modal.inset-bg')};
    }

    .${prefix('HeightTypeLayoutItem20')} {
      width: 42.5px;
      height: 20px;
      border-radius: 6px;
      border: 1px solid ${getColor('settings.border')};
      padding: 2.5px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .${prefix('HeightTypeLayoutItem20Inner')} {
      width: 37.5px;
      height: 14px;
      border-radius: 3.5px;
      border: 1px solid ${getColor('settings.border')};
      background-color: ${getColor('modal.inset-bg')};
    }

    .${prefix('HeightTypeLayoutSameWidth')} {
      width: 34.5px !important;
  }

    .${prefix('HeightTypeLayoutItem60Same')} {
      width: 42.5px;
      height: 60px;
      border-radius: 6px;
      border: 1px solid ${getColor('settings.border')};
      padding: 2.5px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .${prefix('HeightTypeLayoutItem100Same')} {
      width: 42.5px;
      height: 85px;
      border-radius: 6px;
      border: 1px solid ${getColor('settings.border')};
      padding: 2.5px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .${prefix('ResponsibilityContainer')} {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: space-around;
    }

    .${prefix('responsibilityDesktop')} {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .${prefix('responsibilityDesktopConfig')} {
      display: flex;
      gap: 12px;
      justify-content: space-between;
    }

    .${prefix('responsibilityMobileConfig')} {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .${prefix('responsibilityDesktopConfigInput')} {
      width: 30px;
    }

    .${prefix('personalAccessTokenContainer')} {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      }
    `);

  const refs = {};
  const node = aadRender(
    refs,
    /*html*/ `
    <div ref="all" data-view-component="true" class="Layout Layout--flowRow-until-md Layout--sidebarPosition-start Layout--sidebarPosition-flowRow-start">
      <div data-view-component="true" class="Layout-sidebar">
          <navigation-list data-turbo-frame="settings-frame" data-catalyst="">
            <div class="pr-md-4 pr-0">
                <nav aria-label="User settings" item_classes="org-menu-item" nav_classes="org-sub-menu" data-view-component="true">
                  <nav-list data-catalyst="">
                      <ul data-target="nav-list.topLevelList" data-view-component="true" class="ActionListWrap">

                      <li nav_classes="org-sub-menu" data-item-id="" data-targets="nav-list.items" data-view-component="true" class="ActionListItem ActionListItem--hasSubItem">
                      <button id="moderation-settings-item" type="button" aria-expanded="false" data-action="
                          click:nav-list#handleItemWithSubItemClick
                          keydown:nav-list#handleItemWithSubItemKeydown
                          " data-view-component="true" class="ActionListContent ActionListContent--visual16">
                          <span class="ActionListItem-visual ActionListItem-visual--leading">
                          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-paintbrush">
                            <path d="M11.134 1.535c.7-.509 1.416-.942 2.076-1.155.649-.21 1.463-.267 2.069.34.603.601.568 1.411.368 2.07-.202.668-.624 1.39-1.125 2.096-1.011 1.424-2.496 2.987-3.775 4.249-1.098 1.084-2.132 1.839-3.04 2.3a3.744 3.744 0 0 1-1.055 3.217c-.431.431-1.065.691-1.657.861-.614.177-1.294.287-1.914.357A21.151 21.151 0 0 1 .797 16H.743l.007-.75H.749L.742 16a.75.75 0 0 1-.743-.742l.743-.008-.742.007v-.054a21.25 21.25 0 0 1 .13-2.284c.067-.647.187-1.287.358-1.914.17-.591.43-1.226.86-1.657a3.746 3.746 0 0 1 3.227-1.054c.466-.893 1.225-1.907 2.314-2.982 1.271-1.255 2.833-2.75 4.245-3.777ZM1.62 13.089c-.051.464-.086.929-.104 1.395.466-.018.932-.053 1.396-.104a10.511 10.511 0 0 0 1.668-.309c.526-.151.856-.325 1.011-.48a2.25 2.25 0 1 0-3.182-3.182c-.155.155-.329.485-.48 1.01a10.515 10.515 0 0 0-.309 1.67Zm10.396-10.34c-1.224.89-2.605 2.189-3.822 3.384l1.718 1.718c1.21-1.205 2.51-2.597 3.387-3.833.47-.662.78-1.227.912-1.662.134-.444.032-.551.009-.575h-.001V1.78c-.014-.014-.113-.113-.548.027-.432.14-.995.462-1.655.942Zm-4.832 7.266-.001.001a9.859 9.859 0 0 0 1.63-1.142L7.155 7.216a9.7 9.7 0 0 0-1.161 1.607c.482.302.889.71 1.19 1.192Z"></path>
                        </svg>
                          </span>
                          <span data-view-component="true" class="ActionListItem-label">
                          Appearance
                          </span>      
                          <span class="ActionListItem-visual ActionListItem-action--trailing">
                            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-chevron-down ActionListItem-collapseIcon">
                                <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
                            </svg>
                          </span>
                      </button>
                      <ul role="list" data-action="keydown:nav-list#handleItemWithSubItemKeydown" ref="navigateToHeightType" aria-labelledby="moderation-settings-item" data-view-component="true" class="ActionList ActionList--subGroup">
                          <li data-item-id="block_users" data-targets="nav-list.items" data-view-component="true" class="ActionListItem--subItem ActionListItem">
                            <a id="item-2d6b5a99-bc28-4d6a-b40f-4cf05061628d"  data-view-component="true" class="ActionListContent" data-turbo-frame="settings-frame">
                            <span data-view-component="true" class="ActionListItem-label">
                            Height Type
                            </span>      
                            </a>
                          </li>
                          <li data-item-id="interaction_limits" ref="navigateToLayout" data-targets="nav-list.items" data-view-component="true" class="ActionListItem--subItem ActionListItem">
                            <a id="item-4adb7eb8-5a07-44a3-b5f1-a76cdad25e40" data-view-component="true" class="ActionListContent" data-turbo-frame="settings-frame">
                            <span data-view-component="true" class="ActionListItem-label">
                            Layout
                            </span>      
                            </a>
                          </li>
                      </ul>
                    </li>
                        <li data-item-id="" data-targets="nav-list.items" ref="navigateToPrivacy" data-view-component="true" class="ActionListItem">
                            <a id="item-bf87e8cc-fd1d-47c4-b112-662fc1a1716f" data-view-component="true" class="ActionListContent ActionListContent--visual16" data-turbo-frame="settings-frame">
                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-accessibility">
                                    <path d="M9.923 5.302c.063.063.122.129.178.198H14A.75.75 0 0 1 14 7h-3.3l.578 5.163.362 2.997a.75.75 0 0 1-1.49.18L9.868 13H6.132l-.282 2.34a.75.75 0 0 1-1.49-.18l.362-2.997L5.3 7H2a.75.75 0 0 1 0-1.5h3.9a2.54 2.54 0 0 1 .176-.198 3 3 0 1 1 3.847 0ZM9.2 7.073h-.001a1.206 1.206 0 0 0-2.398 0L6.305 11.5h3.39ZM9.5 3a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 3Z"></path>
                                  </svg>
                              </span>
                              <span data-view-component="true" class="ActionListItem-label">
                              Privacy
                              </span>      
                            </a>
                        </li>
                        <li data-item-id="ssh_and_gpg_keys gpg_keys ssh_keys" ref="navigateToAuthorization" data-targets="nav-list.items" data-view-component="true" class="ActionListItem">
                          <a id="item-ad0ea17e-10ad-4e85-91ed-e65ee927ff02" data-view-component="true" class="ActionListContent ActionListContent--visual16" data-turbo-frame="settings-frame">
                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-key">
                                    <path d="M10.5 0a5.499 5.499 0 1 1-1.288 10.848l-.932.932a.749.749 0 0 1-.53.22H7v.75a.749.749 0 0 1-.22.53l-.5.5a.749.749 0 0 1-.53.22H5v.75a.749.749 0 0 1-.22.53l-.5.5a.749.749 0 0 1-.53.22h-2A1.75 1.75 0 0 1 0 14.25v-2c0-.199.079-.389.22-.53l4.932-4.932A5.5 5.5 0 0 1 10.5 0Zm-4 5.5c-.001.431.069.86.205 1.269a.75.75 0 0 1-.181.768L1.5 12.56v1.69c0 .138.112.25.25.25h1.69l.06-.06v-1.19a.75.75 0 0 1 .75-.75h1.19l.06-.06v-1.19a.75.75 0 0 1 .75-.75h1.19l1.023-1.025a.75.75 0 0 1 .768-.18A4 4 0 1 0 6.5 5.5ZM11 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path>
                                </svg>
                              </span>
                              <span data-view-component="true" class="ActionListItem-label">
                              Authorization
                              </span>      
                          </a>
                        </li>
                        <!--
                        <li role="presentation" aria-hidden="true" data-view-component="true" class="ActionList-sectionDivider"></li>
                        <li data-view-component="true">
                            <nav-list-group data-catalyst="">
                              <action-list data-catalyst="">
                                  <div data-view-component="true">
                                    <div data-view-component="true" class="ActionList-sectionDivider">
                                        <h2 id="heading-title-a1aa5c0e-4750-4ae3-8f8a-c864c2d93bf1" data-view-component="true" class="ActionList-sectionDivider-title">
                                          Access
                                        </h2>
                                    </div>
                                    <ul id="group-db1036c0-e678-4652-b650-825343f21d84" role="list" aria-labelledby="heading-title-a1aa5c0e-4750-4ae3-8f8a-c864c2d93bf1" data-view-component="true" class="ActionListWrap">
                                        <li data-item-id="" data-targets="nav-list.items" data-view-component="true" class="ActionListItem ActionListItem--hasSubItem">
                                          <button id="item-2b4dbe0f-511d-463f-b5ae-b69ad7860cc7" type="button" aria-expanded="false" data-action="
                                              click:nav-list#handleItemWithSubItemClick
                                              keydown:nav-list#handleItemWithSubItemKeydown
                                              " data-view-component="true" class="ActionListContent ActionListContent--visual16">
                                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-credit-card">
                                                    <path d="M10.75 9a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Z"></path>
                                                    <path d="M0 3.75C0 2.784.784 2 1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25ZM14.5 6.5h-13v5.75c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25Zm0-2.75a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25V5h13Z"></path>
                                                </svg>
                                              </span>
                                              <span data-view-component="true" class="ActionListItem-label">
                                              Billing and plans
                                              </span>      
                                              <span class="ActionListItem-visual ActionListItem-action--trailing">
                                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-chevron-down ActionListItem-collapseIcon">
                                                    <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
                                                </svg>
                                              </span>
                                          </button>
                                          <ul role="list" data-action="keydown:nav-list#handleItemWithSubItemKeydown" aria-labelledby="item-2b4dbe0f-511d-463f-b5ae-b69ad7860cc7" data-view-component="true" class="ActionList ActionList--subGroup">
                                              <li data-item-id="user_billing_settings" data-targets="nav-list.items" data-view-component="true" class="ActionListItem--subItem ActionListItem">
                                                <a id="item-0a7389a7-9a8a-40da-b49e-33bd57837efd" href="https://github.com/settings/billing/summary" data-view-component="true" class="ActionListContent" data-turbo-frame="settings-frame">
                                                <span data-view-component="true" class="ActionListItem-label">
                                                Plans and usage
                                                </span>      
                                                </a>
                                              </li>
                                              <li data-item-id="spending_limits" data-targets="nav-list.items" data-view-component="true" class="ActionListItem--subItem ActionListItem">
                                                <a id="item-0b802d40-9ef4-4b15-91a1-9208a91d2511" href="https://github.com/settings/billing/spending_limit" data-view-component="true" class="ActionListContent" data-turbo-frame="settings-frame">
                                                <span data-view-component="true" class="ActionListItem-label">
                                                Spending limits
                                                </span>      
                                                </a>
                                              </li>
                                              <li data-item-id="payment_information" data-targets="nav-list.items" data-view-component="true" class="ActionListItem--subItem ActionListItem">
                                                <a id="item-087564ff-b96e-4c2f-94d9-c6600d6d2a81" href="https://github.com/settings/billing/payment_information" data-view-component="true" class="ActionListContent" data-turbo-frame="settings-frame">
                                                <span data-view-component="true" class="ActionListItem-label">
                                                Payment information
                                                </span>      
                                                </a>
                                              </li>
                                          </ul>
                                        </li>
                                        <li data-item-id="" data-targets="nav-list.items" data-view-component="true" class="ActionListItem">
                                          <a id="item-79b19087-917f-4e98-8c62-a3c555084f81" href="/settings/emails" data-view-component="true" class="ActionListContent ActionListContent--visual16" data-turbo-frame="settings-frame">
                                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-mail">
                                                    <path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 9.397a.75.75 0 0 1-.76 0L1.5 5.809v6.442Zm13-8.181v-.32a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.32L8 7.88Z"></path>
                                                </svg>
                                              </span>
                                              <span data-view-component="true" class="ActionListItem-label">
                                              Emails
                                              </span>      
                                          </a>
                                        </li>
                                        <li data-item-id="" data-targets="nav-list.items" data-view-component="true" class="ActionListItem">
                                          <a id="item-6f1e4da1-a2c2-4685-8608-7ae750881641" href="/settings/security" data-view-component="true" class="ActionListContent ActionListContent--visual16" data-turbo-frame="settings-frame">
                                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-shield-lock">
                                                    <path d="m8.533.133 5.25 1.68A1.75 1.75 0 0 1 15 3.48V7c0 1.566-.32 3.182-1.303 4.682-.983 1.498-2.585 2.813-5.032 3.855a1.697 1.697 0 0 1-1.33 0c-2.447-1.042-4.049-2.357-5.032-3.855C1.32 10.182 1 8.566 1 7V3.48a1.75 1.75 0 0 1 1.217-1.667l5.25-1.68a1.748 1.748 0 0 1 1.066 0Zm-.61 1.429.001.001-5.25 1.68a.251.251 0 0 0-.174.237V7c0 1.36.275 2.666 1.057 3.859.784 1.194 2.121 2.342 4.366 3.298a.196.196 0 0 0 .154 0c2.245-.957 3.582-2.103 4.366-3.297C13.225 9.666 13.5 8.358 13.5 7V3.48a.25.25 0 0 0-.174-.238l-5.25-1.68a.25.25 0 0 0-.153 0ZM9.5 6.5c0 .536-.286 1.032-.75 1.3v2.45a.75.75 0 0 1-1.5 0V7.8A1.5 1.5 0 1 1 9.5 6.5Z"></path>
                                                </svg>
                                              </span>
                                              <span data-view-component="true" class="ActionListItem-label">
                                              Password and authentication
                                              </span>      
                                          </a>
                                        </li>
                                        <li data-item-id="" data-targets="nav-list.items" data-view-component="true" class="ActionListItem">
                                          <a id="item-a5a7021b-57dc-4a8f-9606-33086a4eb891" href="/settings/sessions" data-view-component="true" class="ActionListContent ActionListContent--visual16" data-turbo-frame="settings-frame">
                                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-broadcast">
                                                    <path d="M8.75 8.582v5.668a.75.75 0 0 1-1.5 0V8.582a1.75 1.75 0 1 1 1.5 0Zm3.983-7.125a.75.75 0 0 1 1.06.026A7.976 7.976 0 0 1 16 7c0 2.139-.84 4.083-2.207 5.517a.75.75 0 1 1-1.086-1.034A6.474 6.474 0 0 0 14.5 7a6.474 6.474 0 0 0-1.793-4.483.75.75 0 0 1 .026-1.06Zm-9.466 0c.3.286.312.76.026 1.06A6.474 6.474 0 0 0 1.5 7a6.47 6.47 0 0 0 1.793 4.483.75.75 0 0 1-1.086 1.034A7.973 7.973 0 0 1 0 7c0-2.139.84-4.083 2.207-5.517a.75.75 0 0 1 1.06-.026Zm8.556 2.321A4.988 4.988 0 0 1 13 7a4.988 4.988 0 0 1-1.177 3.222.75.75 0 1 1-1.146-.967A3.487 3.487 0 0 0 11.5 7c0-.86-.309-1.645-.823-2.255a.75.75 0 0 1 1.146-.967Zm-6.492.958A3.48 3.48 0 0 0 4.5 7a3.48 3.48 0 0 0 .823 2.255.75.75 0 0 1-1.146.967A4.981 4.981 0 0 1 3 7a4.982 4.982 0 0 1 1.188-3.236.75.75 0 1 1 1.143.972Z"></path>
                                                </svg>
                                              </span>
                                              <span data-view-component="true" class="ActionListItem-label">
                                              Sessions
                                              </span>      
                                          </a>
                                        </li>
                                        
                                        <li data-item-id="" data-targets="nav-list.items" data-view-component="true" class="ActionListItem">
                                          <a id="item-90394458-bcb9-4e54-82fc-76b2beab1760" href="/settings/organizations" data-view-component="true" class="ActionListContent ActionListContent--visual16" data-turbo-frame="settings-frame">
                                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-organization">
                                                    <path d="M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 0 0 .25-.25V8.285a.25.25 0 0 0-.111-.208l-1.055-.703a.749.749 0 1 1 .832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0 1 14.25 16h-3.5a.766.766 0 0 1-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 0 1-.75-.75V14h-1v1.25a.75.75 0 0 1-.75.75Zm-.25-1.75c0 .138.112.25.25.25H4v-1.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v1.25h2.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25ZM3.75 6h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 3.75A.75.75 0 0 1 3.75 3h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 3.75Zm4 3A.75.75 0 0 1 7.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 6.75ZM7.75 3h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 9.75A.75.75 0 0 1 3.75 9h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 9.75ZM7.75 9h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5Z"></path>
                                                </svg>
                                              </span>
                                              <span data-view-component="true" class="ActionListItem-label">
                                              Organizations
                                              </span>      
                                          </a>
                                        </li>
                                        <li data-analytics-event="{&quot;category&quot;:&quot;enterprises_more_discoverable&quot;,&quot;action&quot;:&quot;click_enterprises&quot;,&quot;label&quot;:&quot;ref_loc:settings_sidebar;ref_cta:enterprises&quot;}" data-item-id="" data-targets="nav-list.items" data-view-component="true" class="ActionListItem">
                                          <a id="item-2cdd27c6-2eda-461d-8b88-56c3d1cc8a42" href="/settings/enterprises" data-view-component="true" class="ActionListContent ActionListContent--visual16" data-turbo-frame="settings-frame">
                                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                                <span data-view-component="true">
                                                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-globe">
                                                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM5.78 8.75a9.64 9.64 0 0 0 1.363 4.177c.255.426.542.832.857 1.215.245-.296.551-.705.857-1.215A9.64 9.64 0 0 0 10.22 8.75Zm4.44-1.5a9.64 9.64 0 0 0-1.363-4.177c-.307-.51-.612-.919-.857-1.215a9.927 9.927 0 0 0-.857 1.215A9.64 9.64 0 0 0 5.78 7.25Zm-5.944 1.5H1.543a6.507 6.507 0 0 0 4.666 5.5c-.123-.181-.24-.365-.352-.552-.715-1.192-1.437-2.874-1.581-4.948Zm-2.733-1.5h2.733c.144-2.074.866-3.756 1.58-4.948.12-.197.237-.381.353-.552a6.507 6.507 0 0 0-4.666 5.5Zm10.181 1.5c-.144 2.074-.866 3.756-1.58 4.948-.12.197-.237.381-.353.552a6.507 6.507 0 0 0 4.666-5.5Zm2.733-1.5a6.507 6.507 0 0 0-4.666-5.5c.123.181.24.365.353.552.714 1.192 1.436 2.874 1.58 4.948Z"></path>
                                                    </svg>
                                                    <track-view data-hydro-view="{&quot;event_type&quot;:&quot;view_rendered&quot;,&quot;payload&quot;:{&quot;name&quot;:&quot;settings_sidebar/enterprises&quot;,&quot;originating_url&quot;:&quot;https://github.com/settings/profile&quot;,&quot;user_id&quot;:77299279}}" data-hydro-view-hmac="3e78c7d8e33799ec66996adea93f9be9c41ffc4af72f6fd457050f341b1dce0e" data-catalyst=""></track-view>
                                                </span>
                                              </span>
                                              <span data-view-component="true" class="ActionListItem-label">
                                              Enterprises
                                              </span>      
                                          </a>
                                        </li>
                                        <li nav_classes="org-sub-menu" data-item-id="" data-targets="nav-list.items" data-view-component="true" class="ActionListItem ActionListItem--hasSubItem">
                                          <button id="moderation-settings-item" type="button" aria-expanded="false" data-action="
                                              click:nav-list#handleItemWithSubItemClick
                                              keydown:nav-list#handleItemWithSubItemKeydown
                                              " data-view-component="true" class="ActionListContent ActionListContent--visual16">
                                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-report">
                                                    <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
                                                </svg>
                                              </span>
                                              <span data-view-component="true" class="ActionListItem-label">
                                              Moderation
                                              </span>      
                                              <span class="ActionListItem-visual ActionListItem-action--trailing">
                                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-chevron-down ActionListItem-collapseIcon">
                                                    <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
                                                </svg>
                                              </span>
                                          </button>
                                          <ul role="list" data-action="keydown:nav-list#handleItemWithSubItemKeydown" aria-labelledby="moderation-settings-item" data-view-component="true" class="ActionList ActionList--subGroup">
                                              <li data-item-id="block_users" data-targets="nav-list.items" data-view-component="true" class="ActionListItem--subItem ActionListItem">
                                                <a id="item-2d6b5a99-bc28-4d6a-b40f-4cf05061628d" href="/settings/blocked_users" data-view-component="true" class="ActionListContent" data-turbo-frame="settings-frame">
                                                <span data-view-component="true" class="ActionListItem-label">
                                                Blocked users
                                                </span>      
                                                </a>
                                              </li>
                                              <li data-item-id="interaction_limits" data-targets="nav-list.items" data-view-component="true" class="ActionListItem--subItem ActionListItem">
                                                <a id="item-4adb7eb8-5a07-44a3-b5f1-a76cdad25e40" href="/settings/interaction_limits" data-view-component="true" class="ActionListContent" data-turbo-frame="settings-frame">
                                                <span data-view-component="true" class="ActionListItem-label">
                                                Interaction limits
                                                </span>      
                                                </a>
                                              </li>
                                              <li data-item-id="code_review_limits" data-targets="nav-list.items" data-view-component="true" class="ActionListItem--subItem ActionListItem">
                                                <a id="item-d16916b1-19c4-4bd2-a19b-0dfe9796c92c" href="/settings/code_review_limits" data-view-component="true" class="ActionListContent" data-turbo-frame="settings-frame">
                                                <span data-view-component="true" class="ActionListItem-label">
                                                Code review limits
                                                </span>      
                                                </a>
                                              </li>
                                          </ul>
                                        </li>
                                    </ul>
                                  </div>
                              </action-list>
                            </nav-list-group>
                        </li>
                        <li role="presentation" aria-hidden="true" data-view-component="true" class="ActionList-sectionDivider"></li>
                        <li data-view-component="true">
                            <nav-list-group data-catalyst="">
                              <action-list data-catalyst="">
                                  <div data-view-component="true">
                                    <div data-view-component="true" class="ActionList-sectionDivider">
                                        <h2 id="heading-title-946c4d55-d061-4092-9db2-c8f05fa61167" data-view-component="true" class="ActionList-sectionDivider-title">
                                          Code, planning, and automation
                                        </h2>
                                    </div>
                                    <ul id="group-3d87db75-e818-4cb3-9235-34b92c248e30" role="list" aria-labelledby="heading-title-946c4d55-d061-4092-9db2-c8f05fa61167" data-view-component="true" class="ActionListWrap">
                                        <li data-item-id="" data-targets="nav-list.items" data-view-component="true" class="ActionListItem">
                                          <a id="item-19a1bcee-c5ff-4c96-aca7-fd0569a961fd" href="/settings/repositories" data-view-component="true" class="ActionListContent ActionListContent--visual16" data-turbo-frame="settings-frame">
                                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo">
                                                    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                                                </svg>
                                              </span>
                                              <span data-view-component="true" class="ActionListItem-label">
                                              Repositories
                                              </span>      
                                          </a>
                                        </li>
                                        <li data-item-id="" data-targets="nav-list.items" data-view-component="true" class="ActionListItem">
                                          <a id="item-62c29300-c5c2-479b-b2a7-0d0107e9f9d8" href="/settings/codespaces" data-view-component="true" class="ActionListContent ActionListContent--visual16" data-turbo-frame="settings-frame">
                                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-codespaces">
                                                    <path d="M0 11.25c0-.966.784-1.75 1.75-1.75h12.5c.966 0 1.75.784 1.75 1.75v3A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm2-9.5C2 .784 2.784 0 3.75 0h8.5C13.216 0 14 .784 14 1.75v5a1.75 1.75 0 0 1-1.75 1.75h-8.5A1.75 1.75 0 0 1 2 6.75Zm1.75-.25a.25.25 0 0 0-.25.25v5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5a.25.25 0 0 0-.25-.25Zm-2 9.5a.25.25 0 0 0-.25.25v3c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-3a.25.25 0 0 0-.25-.25Z"></path>
                                                    <path d="M7 12.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm-4 0a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Z"></path>
                                                </svg>
                                              </span>
                                              <span data-view-component="true" class="ActionListItem-label">
                                              Codespaces
                                              </span>      
                                          </a>
                                        </li>
                                        <li data-item-id="" data-targets="nav-list.items" data-view-component="true" class="ActionListItem">
                                          <a id="item-f8c246c2-c1a7-43b7-b074-0872e3bc18b4" href="/settings/packages" data-view-component="true" class="ActionListContent ActionListContent--visual16" data-turbo-frame="settings-frame">
                                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-package">
                                                    <path d="m8.878.392 5.25 3.045c.54.314.872.89.872 1.514v6.098a1.75 1.75 0 0 1-.872 1.514l-5.25 3.045a1.75 1.75 0 0 1-1.756 0l-5.25-3.045A1.75 1.75 0 0 1 1 11.049V4.951c0-.624.332-1.201.872-1.514L7.122.392a1.75 1.75 0 0 1 1.756 0ZM7.875 1.69l-4.63 2.685L8 7.133l4.755-2.758-4.63-2.685a.248.248 0 0 0-.25 0ZM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432Zm6.25 8.271 4.625-2.683a.25.25 0 0 0 .125-.216V5.677L8.75 8.432Z"></path>
                                                </svg>
                                              </span>
                                              <span data-view-component="true" class="ActionListItem-label">
                                              Packages
                                              </span>      
                                          </a>
                                        </li>
                                        <li data-item-id="" data-targets="nav-list.items" data-view-component="true" class="ActionListItem">
                                          <a id="item-425e36e4-fcaf-4ee4-853a-b023040fbc14" href="/settings/copilot" data-view-component="true" class="ActionListContent ActionListContent--visual16" data-turbo-frame="settings-frame">
                                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copilot">
                                                    <path d="M7.998 15.035c-4.562 0-7.873-2.914-7.998-3.749V9.338c.085-.628.677-1.686 1.588-2.065.013-.07.024-.143.036-.218.029-.183.06-.384.126-.612-.201-.508-.254-1.084-.254-1.656 0-.87.128-1.769.693-2.484.579-.733 1.494-1.124 2.724-1.261 1.206-.134 2.262.034 2.944.765.05.053.096.108.139.165.044-.057.094-.112.143-.165.682-.731 1.738-.899 2.944-.765 1.23.137 2.145.528 2.724 1.261.566.715.693 1.614.693 2.484 0 .572-.053 1.148-.254 1.656.066.228.098.429.126.612.012.076.024.148.037.218.924.385 1.522 1.471 1.591 2.095v1.872c0 .766-3.351 3.795-8.002 3.795Zm0-1.485c2.28 0 4.584-1.11 5.002-1.433V7.862l-.023-.116c-.49.21-1.075.291-1.727.291-1.146 0-2.059-.327-2.71-.991A3.222 3.222 0 0 1 8 6.303a3.24 3.24 0 0 1-.544.743c-.65.664-1.563.991-2.71.991-.652 0-1.236-.081-1.727-.291l-.023.116v4.255c.419.323 2.722 1.433 5.002 1.433ZM6.762 2.83c-.193-.206-.637-.413-1.682-.297-1.019.113-1.479.404-1.713.7-.247.312-.369.789-.369 1.554 0 .793.129 1.171.308 1.371.162.181.519.379 1.442.379.853 0 1.339-.235 1.638-.54.315-.322.527-.827.617-1.553.117-.935-.037-1.395-.241-1.614Zm4.155-.297c-1.044-.116-1.488.091-1.681.297-.204.219-.359.679-.242 1.614.091.726.303 1.231.618 1.553.299.305.784.54 1.638.54.922 0 1.28-.198 1.442-.379.179-.2.308-.578.308-1.371 0-.765-.123-1.242-.37-1.554-.233-.296-.693-.587-1.713-.7Z"></path>
                                                    <path d="M6.25 9.037a.75.75 0 0 1 .75.75v1.501a.75.75 0 0 1-1.5 0V9.787a.75.75 0 0 1 .75-.75Zm4.25.75v1.501a.75.75 0 0 1-1.5 0V9.787a.75.75 0 0 1 1.5 0Z"></path>
                                                </svg>
                                              </span>
                                              <span data-view-component="true" class="ActionListItem-label">
                                              Copilot
                                              </span>      
                                          </a>
                                        </li>
                                        <li data-item-id="" data-targets="nav-list.items" data-view-component="true" class="ActionListItem">
                                          <a id="item-22e5ba29-0f8e-41f0-8bd6-37f85db2c678" href="/settings/pages" data-view-component="true" class="ActionListContent ActionListContent--visual16" data-turbo-frame="settings-frame">
                                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-browser">
                                                    <path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25ZM14.5 6h-13v7.25c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25Zm-6-3.5v2h6V2.75a.25.25 0 0 0-.25-.25ZM5 2.5v2h2v-2Zm-3.25 0a.25.25 0 0 0-.25.25V4.5h2v-2Z"></path>
                                                </svg>
                                              </span>
                                              <span data-view-component="true" class="ActionListItem-label">
                                              Pages
                                              </span>      
                                          </a>
                                        </li>
                                        <li data-item-id="edit_saved_reply saved_replies" data-targets="nav-list.items" data-view-component="true" class="ActionListItem">
                                          <a id="item-a374efdc-2443-4ebc-abbb-710e1573fca4" href="/settings/replies" data-view-component="true" class="ActionListContent ActionListContent--visual16" data-turbo-frame="settings-frame">
                                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-reply">
                                                    <path d="M6.78 1.97a.75.75 0 0 1 0 1.06L3.81 6h6.44A4.75 4.75 0 0 1 15 10.75v2.5a.75.75 0 0 1-1.5 0v-2.5a3.25 3.25 0 0 0-3.25-3.25H3.81l2.97 2.97a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L1.47 7.28a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"></path>
                                                </svg>
                                              </span>
                                              <span data-view-component="true" class="ActionListItem-label">
                                              Saved replies
                                              </span>      
                                          </a>
                                        </li>
                                    </ul>
                                  </div>
                              </action-list>
                            </nav-list-group>
                        </li>
                        <li role="presentation" aria-hidden="true" data-view-component="true" class="ActionList-sectionDivider"></li>
                        <li data-view-component="true">
                            <nav-list-group data-catalyst="">
                              <action-list data-catalyst="">
                                  <div data-view-component="true">
                                    <div data-view-component="true" class="ActionList-sectionDivider">
                                        <h2 id="heading-title-b911e1df-3533-48f9-92dd-4c6457fec081" data-view-component="true" class="ActionList-sectionDivider-title">
                                          Security
                                        </h2>
                                    </div>
                                    <ul id="group-14dec600-ce1f-4b30-94f2-83be347f0135" role="list" aria-labelledby="heading-title-b911e1df-3533-48f9-92dd-4c6457fec081" data-view-component="true" class="ActionListWrap">
                                        <li data-item-id="security_analysis" data-targets="nav-list.items" data-view-component="true" class="ActionListItem">
                                          <a id="item-268cee83-63d2-4809-b474-2388f50f7da9" href="/settings/security_analysis" data-view-component="true" class="ActionListContent ActionListContent--visual16" data-turbo-frame="settings-frame">
                                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-shield-lock">
                                                    <path d="m8.533.133 5.25 1.68A1.75 1.75 0 0 1 15 3.48V7c0 1.566-.32 3.182-1.303 4.682-.983 1.498-2.585 2.813-5.032 3.855a1.697 1.697 0 0 1-1.33 0c-2.447-1.042-4.049-2.357-5.032-3.855C1.32 10.182 1 8.566 1 7V3.48a1.75 1.75 0 0 1 1.217-1.667l5.25-1.68a1.748 1.748 0 0 1 1.066 0Zm-.61 1.429.001.001-5.25 1.68a.251.251 0 0 0-.174.237V7c0 1.36.275 2.666 1.057 3.859.784 1.194 2.121 2.342 4.366 3.298a.196.196 0 0 0 .154 0c2.245-.957 3.582-2.103 4.366-3.297C13.225 9.666 13.5 8.358 13.5 7V3.48a.25.25 0 0 0-.174-.238l-5.25-1.68a.25.25 0 0 0-.153 0ZM9.5 6.5c0 .536-.286 1.032-.75 1.3v2.45a.75.75 0 0 1-1.5 0V7.8A1.5 1.5 0 1 1 9.5 6.5Z"></path>
                                                </svg>
                                              </span>
                                              <span data-view-component="true" class="ActionListItem-label">
                                              Code security and analysis
                                              </span>      
                                          </a>
                                        </li>
                                    </ul>
                                  </div>
                              </action-list>
                            </nav-list-group>
                        </li>
                        <li role="presentation" aria-hidden="true" data-view-component="true" class="ActionList-sectionDivider"></li>
                        <li data-view-component="true">
                            <nav-list-group data-catalyst="">
                              <action-list data-catalyst="">
                                  <div data-view-component="true">
                                    <div data-view-component="true" class="ActionList-sectionDivider">
                                        <h3 id="heading-title-1660f5bd-08a0-460c-b0ca-04923204b895" data-view-component="true" class="ActionList-sectionDivider-title">
                                          Integrations
                                        </h3>
                                    </div>
                                    <ul id="group-15e0127c-3b45-416b-b70e-45939f7a2d79" role="list" aria-labelledby="heading-title-1660f5bd-08a0-460c-b0ca-04923204b895" data-view-component="true" class="ActionListWrap">
                                        <li data-item-id="applications_settings integration_installations" data-targets="nav-list.items" data-view-component="true" class="ActionListItem">
                                          <a id="item-b15c7082-1991-4180-a39b-fb7780e39a53" href="/settings/installations" data-view-component="true" class="ActionListContent ActionListContent--visual16" data-turbo-frame="settings-frame">
                                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-apps">
                                                    <path d="M1.5 3.25c0-.966.784-1.75 1.75-1.75h2.5c.966 0 1.75.784 1.75 1.75v2.5A1.75 1.75 0 0 1 5.75 7.5h-2.5A1.75 1.75 0 0 1 1.5 5.75Zm7 0c0-.966.784-1.75 1.75-1.75h2.5c.966 0 1.75.784 1.75 1.75v2.5a1.75 1.75 0 0 1-1.75 1.75h-2.5A1.75 1.75 0 0 1 8.5 5.75Zm-7 7c0-.966.784-1.75 1.75-1.75h2.5c.966 0 1.75.784 1.75 1.75v2.5a1.75 1.75 0 0 1-1.75 1.75h-2.5a1.75 1.75 0 0 1-1.75-1.75Zm7 0c0-.966.784-1.75 1.75-1.75h2.5c.966 0 1.75.784 1.75 1.75v2.5a1.75 1.75 0 0 1-1.75 1.75h-2.5a1.75 1.75 0 0 1-1.75-1.75ZM3.25 3a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h2.5A.25.25 0 0 0 6 5.75v-2.5A.25.25 0 0 0 5.75 3Zm7 0a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h2.5a.25.25 0 0 0 .25-.25v-2.5a.25.25 0 0 0-.25-.25Zm-7 7a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h2.5a.25.25 0 0 0 .25-.25v-2.5a.25.25 0 0 0-.25-.25Zm7 0a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h2.5a.25.25 0 0 0 .25-.25v-2.5a.25.25 0 0 0-.25-.25Z"></path>
                                                </svg>
                                              </span>
                                              <span data-view-component="true" class="ActionListItem-label">
                                              Applications
                                              </span>      
                                          </a>
                                        </li>
                                        <li data-item-id="reminders" data-targets="nav-list.items" data-view-component="true" class="ActionListItem">
                                          <a id="item-22246810-4605-4e25-b8be-2a61bb936131" href="/settings/reminders" data-view-component="true" class="ActionListContent ActionListContent--visual16" data-turbo-frame="settings-frame">
                                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-clock">
                                                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"></path>
                                                </svg>
                                              </span>
                                              <span data-view-component="true" class="ActionListItem-label">
                                              Scheduled reminders
                                              </span>      
                                          </a>
                                        </li>
                                    </ul>
                                  </div>
                              </action-list>
                            </nav-list-group>
                        </li>
                        <li role="presentation" aria-hidden="true" data-view-component="true" class="ActionList-sectionDivider"></li>
                        <li data-view-component="true">
                            <nav-list-group data-catalyst="">
                              <action-list data-catalyst="">
                                  <div data-view-component="true">
                                    <div data-view-component="true" class="ActionList-sectionDivider">
                                        <h2 id="heading-title-4fbd5022-731b-4ae0-9a3e-d27b0b678921" data-view-component="true" class="ActionList-sectionDivider-title">
                                          Archives
                                        </h2>
                                    </div>
                                    <ul id="group-e7d47d17-1080-410a-b01b-b9ca002e1049" role="list" aria-labelledby="heading-title-4fbd5022-731b-4ae0-9a3e-d27b0b678921" data-view-component="true" class="ActionListWrap">
                                        <li data-item-id="" data-targets="nav-list.items" data-view-component="true" class="ActionListItem">
                                          <a id="item-f6c95dca-0413-43b6-92f5-a070f142f3b0" href="/settings/security-log" data-view-component="true" class="ActionListContent ActionListContent--visual16" data-turbo-frame="settings-frame">
                                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-log">
                                                    <path d="M5 8.25a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4A.75.75 0 0 1 5 8.25ZM4 10.5A.75.75 0 0 0 4 12h4a.75.75 0 0 0 0-1.5H4Z"></path>
                                                    <path d="M13-.005c1.654 0 3 1.328 3 3 0 .982-.338 1.933-.783 2.818-.443.879-1.028 1.758-1.582 2.588l-.011.017c-.568.853-1.104 1.659-1.501 2.446-.398.789-.623 1.494-.623 2.136a1.5 1.5 0 1 0 2.333-1.248.75.75 0 0 1 .834-1.246A3 3 0 0 1 13 16H3a3 3 0 0 1-3-3c0-1.582.891-3.135 1.777-4.506.209-.322.418-.637.623-.946.473-.709.923-1.386 1.287-2.048H2.51c-.576 0-1.381-.133-1.907-.783A2.68 2.68 0 0 1 0 2.995a3 3 0 0 1 3-3Zm0 1.5a1.5 1.5 0 0 0-1.5 1.5c0 .476.223.834.667 1.132A.75.75 0 0 1 11.75 5.5H5.368c-.467 1.003-1.141 2.015-1.773 2.963-.192.289-.381.571-.558.845C2.13 10.711 1.5 11.916 1.5 13A1.5 1.5 0 0 0 3 14.5h7.401A2.989 2.989 0 0 1 10 13c0-.979.338-1.928.784-2.812.441-.874 1.023-1.748 1.575-2.576l.017-.026c.568-.853 1.103-1.658 1.501-2.448.398-.79.623-1.497.623-2.143 0-.838-.669-1.5-1.5-1.5Zm-10 0a1.5 1.5 0 0 0-1.5 1.5c0 .321.1.569.27.778.097.12.325.227.74.227h7.674A2.737 2.737 0 0 1 10 2.995c0-.546.146-1.059.401-1.5Z"></path>
                                                </svg>
                                              </span>
                                              <span data-view-component="true" class="ActionListItem-label">
                                              Security log
                                              </span>      
                                          </a>
                                        </li>
                                        <li data-item-id="" data-targets="nav-list.items" data-view-component="true" class="ActionListItem">
                                          <a id="item-849a78d7-24e4-44e2-9a3c-929d63e6f5fd" href="/settings/sponsors-log" data-view-component="true" class="ActionListContent ActionListContent--visual16" data-turbo-frame="settings-frame">
                                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-log">
                                                    <path d="M5 8.25a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4A.75.75 0 0 1 5 8.25ZM4 10.5A.75.75 0 0 0 4 12h4a.75.75 0 0 0 0-1.5H4Z"></path>
                                                    <path d="M13-.005c1.654 0 3 1.328 3 3 0 .982-.338 1.933-.783 2.818-.443.879-1.028 1.758-1.582 2.588l-.011.017c-.568.853-1.104 1.659-1.501 2.446-.398.789-.623 1.494-.623 2.136a1.5 1.5 0 1 0 2.333-1.248.75.75 0 0 1 .834-1.246A3 3 0 0 1 13 16H3a3 3 0 0 1-3-3c0-1.582.891-3.135 1.777-4.506.209-.322.418-.637.623-.946.473-.709.923-1.386 1.287-2.048H2.51c-.576 0-1.381-.133-1.907-.783A2.68 2.68 0 0 1 0 2.995a3 3 0 0 1 3-3Zm0 1.5a1.5 1.5 0 0 0-1.5 1.5c0 .476.223.834.667 1.132A.75.75 0 0 1 11.75 5.5H5.368c-.467 1.003-1.141 2.015-1.773 2.963-.192.289-.381.571-.558.845C2.13 10.711 1.5 11.916 1.5 13A1.5 1.5 0 0 0 3 14.5h7.401A2.989 2.989 0 0 1 10 13c0-.979.338-1.928.784-2.812.441-.874 1.023-1.748 1.575-2.576l.017-.026c.568-.853 1.103-1.658 1.501-2.448.398-.79.623-1.497.623-2.143 0-.838-.669-1.5-1.5-1.5Zm-10 0a1.5 1.5 0 0 0-1.5 1.5c0 .321.1.569.27.778.097.12.325.227.74.227h7.674A2.737 2.737 0 0 1 10 2.995c0-.546.146-1.059.401-1.5Z"></path>
                                                </svg>
                                              </span>
                                              <span data-view-component="true" class="ActionListItem-label">
                                              Sponsorship log
                                              </span>      
                                          </a>
                                        </li>
                                    </ul>
                                  </div>
                              </action-list>
                            </nav-list-group>
                        </li>
                        <li role="presentation" aria-hidden="true" data-view-component="true" class="ActionList-sectionDivider"></li>
                        <li data-item-id="" data-targets="nav-list.items" data-view-component="true" class="ActionListItem">
                            <a id="item-a39a22ca-b8b9-4d06-8aaa-829612c73820" href="/settings/apps" data-view-component="true" class="ActionListContent ActionListContent--visual16" data-turbo-frame="settings-frame">
                              <span class="ActionListItem-visual ActionListItem-visual--leading">
                                  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-code">
                                    <path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z"></path>
                                  </svg>
                              </span>
                              <span data-view-component="true" class="ActionListItem-label">
                              Developer settings
                              </span>      
                            </a>
                        </li>
                        -->
                      </ul>
                  </nav-list>
                </nav>
            </div>
          </navigation-list>
      </div>
      <div data-view-component="true" class="Layout-main">
          <div data-view-component="true" class="Layout-main-centered-xl">
            <div data-view-component="true" class="container-xl">
                <turbo-frame id="settings-frame" data-turbo-action="advance" class="${prefix(
                  'settingsCONTAINER'
                )}" complete="">
                  <div data-view-component="true" class="Subhead" style="margin-bottom: 0px;">
                      <h2 data-view-component="true" class="Subhead-heading Subhead-heading--large" >Appearance</h2>
                  </div>

                  <dl class="form-group">
                    <dt ref="aadNavigateableHeightType">
                      <label for="user_profile_pronouns_select">Height Type</label>
                    </dt>
                    <dd class="user-profile-bio-field-container js-length-limited-input-container">
                      <fieldset class="${prefix('heightTypeFieldSet')}">
                        <div>
                          <input type="radio" id="fit" name="htype" value="fit" checked />
                          <label for="fit">
                            <div class="note">
                              Fit to content
                            </div>
                            <div class="${prefix('HeightTypeLayoutContainer')}">
                              <div class="${prefix(
                                'HeightTypeLayoutItem30'
                              )} ${prefix('HeightTypeLayoutItemFirst')}">
                                <div class="${prefix(
                                  'HeightTypeLayoutItem30Inner'
                                )} ${prefix(
      'HeightTypeLayoutItem30InnerFirst'
    )}"></div>
                              </div>
                              <div class="${prefix('HeightTypeLayoutItem50')}">
                                <div class="${prefix(
                                  'HeightTypeLayoutItem50Inner'
                                )}"></div>
                              </div>
                              <div class="${prefix('HeightTypeLayoutItem60')}">
                                <div class="${prefix(
                                  'HeightTypeLayoutItem60Inner'
                                )}"></div>
                              </div>
                              <div class="${prefix(
                                'HeightTypeLayoutItem20'
                              )} ${prefix('HeightTypeLayoutItemLast')}">
                                <div class="${prefix(
                                  'HeightTypeLayoutItem20Inner'
                                )} ${prefix(
      'HeightTypeLayoutItem30InnerLast'
    )}"></div>
                              </div>
                            </div>
                          </label>
                        </div>
                      
                        <div>
                          <input type="radio" id="sameHeight" name="htype" value="sameHeight" />
                          <label for="sameHeight">
                          <div class="note">
                            Fit to other container's height
                            </div>
                            <div class="${prefix('HeightTypeLayoutContainer')}">
                              <div class="${prefix(
                                'HeightTypeLayoutItem60Same'
                              )} ${prefix('HeightTypeLayoutItemFirst')}">
                                <div class="${prefix(
                                  'HeightTypeLayoutItem30Inner'
                                )} ${prefix(
      'HeightTypeLayoutItem30InnerFirst'
    )} ${prefix('HeightTypeLayoutSameWidth')}"></div>
                              </div>
                              <div class="${prefix(
                                'HeightTypeLayoutItem60Same'
                              )}">
                                <div class="${prefix(
                                  'HeightTypeLayoutItem50Inner'
                                )} ${prefix(
      'HeightTypeLayoutSameWidth'
    )}"></div>
                              </div>
                              <div class="${prefix(
                                'HeightTypeLayoutItem60Same'
                              )}">
                                <div class="${prefix(
                                  'HeightTypeLayoutItem60Inner'
                                )} ${prefix(
      'HeightTypeLayoutSameWidth'
    )}"></div>
                              </div>
                              <div class="${prefix(
                                'HeightTypeLayoutItem60Same'
                              )} ${prefix('HeightTypeLayoutItemLast')}">
                                <div class="${prefix(
                                  'HeightTypeLayoutItem20Inner'
                                )} ${prefix(
      'HeightTypeLayoutItem30InnerLast'
    )} ${prefix('HeightTypeLayoutSameWidth')}"></div>
                              </div>
                            </div>
                          </label>
                        </div>
                      
                        <div>
                          <input type="radio" id="sameHeightWithMinDVH" name="htype" value="sameHeightWithMinDVH" />
                          <label for="sameHeightWithMinDVH">
                          <div class="note">
                            Fit to other container's height with min DVH
                            </div>
                            <div class="${prefix('HeightTypeLayoutContainer')}">
                              <div class="${prefix(
                                'HeightTypeLayoutItem100Same'
                              )} ${prefix(
      'HeightTypeLayoutItemFirst'
    )} ${prefix('HeightTypeLayoutItem100InnerFirst')}">
                                <div class="${prefix(
                                  'HeightTypeLayoutItem30Inner'
                                )} ${prefix(
      'HeightTypeLayoutItem30InnerFirst'
    )} ${prefix('HeightTypeLayoutSameWidth')}  "></div>
                              </div>
                              <div class="${prefix(
                                'HeightTypeLayoutItem100Same'
                              )}">
                                <div class="${prefix(
                                  'HeightTypeLayoutItem50Inner'
                                )} ${prefix(
      'HeightTypeLayoutSameWidth'
    )}"></div>
                              </div>
                              <div class="${prefix(
                                'HeightTypeLayoutItem100Same'
                              )}">
                                <div class="${prefix(
                                  'HeightTypeLayoutItem60Inner'
                                )} ${prefix(
      'HeightTypeLayoutSameWidth'
    )}"></div>
                              </div>
                              <div class="${prefix(
                                'HeightTypeLayoutItem100Same'
                              )} ${prefix('HeightTypeLayoutItemLast')} ${prefix(
      'HeightTypeLayoutItem100InnerLast'
    )}">
                                <div class="${prefix(
                                  'HeightTypeLayoutItem20Inner'
                                )} ${prefix(
      'HeightTypeLayoutItem30InnerLast'
    )} ${prefix('HeightTypeLayoutSameWidth')}  "></div>
                              </div>
                            </div>
                          </label>
                        </div>
                      </fieldset>
                      <div class="note">
                        This setting controls how the height of the container is calculated.
                      </div>
                    </dd>
                    <p>
                      <button style="margin-top: 8px;" ref="heightTypeSave" data-target="waiting-form.submit" data-action="click:waiting-form#submitPolitely" type="submit" data-view-component="true" class="Button--primary Button--medium Button">  <span class="Button-content">
                        <span class="Button-label">Update Height Type</span>
                        </span>
                      </button>
                    </p>
                  </dl>

                  <dl class="form-group">
                    <dt ref="aadNavigateableLayout">  
                      <label for="user_profile_pronouns_select">Layout</label>
                    </dt>
                    <dd class="user-profile-bio-field-container js-length-limited-input-container">
                      <div class="${prefix('responsibilityContainer')}">
                        <div class="${prefix('responsibilityDesktop')}">
                          <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0.5" y="0.5" width="199" height="99" rx="14.5" stroke="#444C56"/>
                          <rect x="6.5" y="6.5" width="41" height="25" rx="9.5" stroke="#444C56"/>
                          <rect x="8" y="8" width="38" height="22" rx="8" fill="#313841"/>
                          <rect x="56" y="8" width="38" height="39" rx="8" fill="#313841"/>
                          <rect x="104" y="8" width="38" height="47" rx="8" fill="#313841"/>
                          <rect x="152" y="8" width="38" height="39" rx="8" fill="#313841"/>
                          <rect x="54.5" y="6.5" width="41.5" height="42" rx="9.5" stroke="#444C56"/>
                          <rect x="102.5" y="6.5" width="41" height="50" rx="9.5" stroke="#444C56"/>
                          <rect x="150.5" y="6.5" width="41.5" height="42" rx="9.5" stroke="#444C56"/>
                          </svg>
                        
                          <div ref="desktopconfig" class="${prefix(
                            'responsibilityMobileConfig'
                          )}">
                            <div class="note">
                              Desktop
                            </div>
                            <!-- 
                            <input type="number" min="1" max="4" value="4" class="${prefix(
                              'responsibilityDesktopConfigInput'
                            )}" />
                            -->
                          </div>
                        </div>

                        <div class="${prefix('responsibilityDesktop')}">
                          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clip-path="url(#clip0_28_22)">
                          <rect x="5.5" y="6.5" width="41" height="25" rx="9.5" stroke="#444C56"/>
                          <rect x="7" y="8" width="38" height="22" rx="8" fill="#313841"/>
                          <rect x="55" y="8" width="38" height="39" rx="8" fill="#313841"/>
                          <rect x="7" y="57" width="38" height="47" rx="8" fill="#313841"/>
                          <rect x="55" y="57" width="38" height="39" rx="8" fill="#313841"/>
                          <rect x="53.5" y="6.5" width="41.5" height="42" rx="9.5" stroke="#444C56"/>
                          <rect x="5.5" y="55.5" width="41" height="50" rx="9.5" stroke="#444C56"/>
                          <rect x="53.5" y="55.5" width="41.5" height="42" rx="9.5" stroke="#444C56"/>
                          </g>
                          <rect x="0.5" y="0.5" width="99" height="99" rx="14.5" stroke="#444C56"/>
                          <defs>
                          <clipPath id="clip0_28_22">
                          <rect width="100" height="100" rx="15" fill="white"/>
                          </clipPath>
                          </defs>
                          </svg>

                        
                          <div ref="tabletconfig" class="${prefix(
                            'responsibilityMobileConfig'
                          )}">
                            <div class="note">
                              Tablet
                            </div>
                            <!-- 
                            <input type="number" min="1" max="4" value="4" class="${prefix(
                              'responsibilityDesktopConfigInput'
                            )}" />
                            -->
                          </div>
                        </div>

                        <div class="${prefix('responsibilityDesktop')}">
                        <svg width="50" height="100" viewBox="0 0 50 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_28_24)">
                        <rect x="4.5" y="6.5" width="41" height="25" rx="9.5" stroke="#444C56"/>
                        <rect x="6" y="8" width="38" height="22" rx="8" fill="#313841"/>
                        <rect x="6" y="37" width="38" height="39" rx="8" fill="#313841"/>
                        <rect x="4.5" y="35.5" width="41.5" height="42" rx="9.5" stroke="#444C56"/>
                        <rect x="6" y="83" width="38" height="39" rx="8" fill="#313841"/>
                        <rect x="4.5" y="81.5" width="41.5" height="42" rx="9.5" stroke="#444C56"/>
                        </g>
                        <rect x="0.5" y="0.5" width="49" height="99" rx="9.5" stroke="#444C56"/>
                        <defs>
                        <clipPath id="clip0_28_24">
                        <rect width="50" height="100" rx="10" fill="white"/>
                        </clipPath>
                        </defs>
                        </svg>
                        
                        
                          <div ref="mobileconfig" class="${prefix(
                            'responsibilityMobileConfig'
                          )}">
                            <div class="note">
                              Mobile
                            </div>
                            <!-- 
                            <input type="number" min="1" max="4" value="4" class="${prefix(
                              'responsibilityDesktopConfigInput'
                            )}" />
                            -->
                          </div>
                        </div>
                      </div>
                      <div class="note">
                        This setting controls how the responsibility of the widget is calculated.
                      </div>
                    </dd>
                    <p>
                      <button style="margin-top: 8px;" ref="saveResponsibility" data-target="waiting-form.submit" data-action="click:waiting-form#submitPolitely" type="submit" data-view-component="true" class="Button--primary Button--medium Button">  <span class="Button-content">
                        <span class="Button-label">Update Responsibilty</span>
                        </span>
                      </button>
                    </p>
                  </dl>


                  <div ref="aadNavigateablePrivacy" data-view-component="true" class="Subhead" style="margin-bottom: 0px;">
                      <h2 data-view-component="true" class="Subhead-heading Subhead-heading--large" >Privacy</h2>
                  </div>
                  <dl>
                    <div class="form-checkbox aad-m-0-hard">
                      <label >
                        Send metrics to the server (anonymous)
                      </label>
                      <input type="checkbox" ref="sendMetricsCheckbox" >
                      <p class="note">
                        This will help us improve the product. We won't collect any personal information and we don't share any data with third parties.
                      </p>
                    </div>
                    <button style="margin-top: 16px;" ref="saveMetrics" data-target="waiting-form.submit" data-action="click:waiting-form#submitPolitely" type="submit" data-view-component="true" class="Button--primary Button--medium Button">  <span class="Button-content">
                        <span class="Button-label">Update Metrics</span>
                        </span>
                      </button>
                  </dl>

                    <div ref="aadNavigateableAuthorization" data-view-component="true" class="Subhead" style="margin-bottom: 0px;">
                      <h2 data-view-component="true" class="Subhead-heading Subhead-heading--large" >Authorization</h2>
                  </div>

                  <dl class="form-group">
                    <dt>
                      <label for="user_profile_pronouns_select">Personal Access Token (PAT)</label>
                    </dt>
                    <dd class="user-profile-bio-field-container js-length-limited-input-container">
                      <div class="${prefix('personalAccessTokenContainer')}">
                        <input ref="patinput" class="form-control" type="password" placeholder="Put your token here(optional)" >
                        <button ref="savePAT" data-target="waiting-form.submit" data-action="click:waiting-form#submitPolitely" type="submit" data-view-component="true" class="Button--primary Button--medium Button">  <span class="Button-content">
                          <span class="Button-label">Save Personal Access Token</span>
                          </span>
                        </button>
                      </div>
                      <div class="note">
                        This token upgrade request limit 60 to 5000 per hour.
                      </div>
                    </dd>
                  </dl>

                  </div>
              </turbo-frame>
          </div>
      </div>
    </div>
    `
  );

  refs.navigateToAuthorization.addEventListener('click', (e) => {
    refs.aadNavigateableAuthorization.scrollIntoView({
      behavior: 'smooth',
    });
  });

  refs.navigateToPrivacy.addEventListener('click', (e) => {
    refs.aadNavigateablePrivacy.scrollIntoView({
      behavior: 'smooth',
    });
  });

  refs.navigateToLayout.addEventListener('click', (e) => {
    refs.aadNavigateableLayout.scrollIntoView({
      behavior: 'smooth',
    });
  });

  refs.navigateToHeightType.addEventListener('click', (e) => {
    refs.aadNavigateableHeightType.scrollIntoView({
      behavior: 'smooth',
    });
  });

  //
  var desktopconfig = refs.desktopconfig;
  var desktopconfigInput = getSettingsInputNumber({
    min: 1,
    max: 16,
    value: widgetResponsibility.breaks.lg.count,
  });
  desktopconfig.aadAppendChild(desktopconfigInput.node);

  var tabletconfig = refs.tabletconfig;
  var tabletconfigInput = getSettingsInputNumber({
    min: 1,
    max: 16,
    value: widgetResponsibility.breaks.md.count,
  });
  tabletconfig.aadAppendChild(tabletconfigInput.node);

  var mobileconfig = refs.mobileconfig;
  var mobileconfigInput = getSettingsInputNumber({
    min: 1,
    max: 16,
    value: widgetResponsibility.breaks.sm.count,
  });
  mobileconfig.aadAppendChild(mobileconfigInput.node);

  refs.saveResponsibility.addEventListener('click', (e) => {
    var lg = desktopconfigInput.refs.input.value;
    var md = tabletconfigInput.refs.input.value;
    var sm = mobileconfigInput.refs.input.value;

    const max = Math.max(lg, md, sm);
    const old = widgetResponsibility.totalWidgetCount;

    widgetResponsibility.breaks.lg.count = lg;
    widgetResponsibility.breaks.md.count = md;
    widgetResponsibility.breaks.sm.count = sm;
    applyWidgetResponsibility();
    saveWidgetResponsibility();

    if (max > old) {
      localStorage.setItem('pleaseReloadPageAgain', 'true');
      window.location.reload();
    }
  });

  var _htype = containerSettings.heightType;
  var _htypeRadio = refs.all.querySelector(
    `input[name="htype"][value="${_htype}"]`
  );
  if (_htypeRadio) {
    _htypeRadio.checked = true;
  }

  refs.heightTypeSave.addEventListener('click', (e) => {
    var htype = document.querySelector('input[name="htype"]:checked').value;

    updateContainerSettings({
      heightType: htype,
    });
  });

  let pat = '';
  getPatFromStorageCB((_pat) => {
    pat = _pat;
    refs.patinput.value = pat;

    // when focus, show the full pat
    refs.patinput.addEventListener('focus', (e) => {
      refs.patinput.setAttribute('type', 'text');
    });

    // when blur, show the masked pat
    refs.patinput.addEventListener('blur', (e) => {
      refs.patinput.setAttribute('type', 'password');
    });

    // when change
    refs.savePAT.addEventListener('change', (e) => {
      pat = refs.patinput.value;
    });

    // when save
    refs.savePAT.addEventListener('click', (e) => {
      setPatToStorage(refs.patinput.value);
    });
  });
 

  // send metrics
  refs.sendMetricsCheckbox.checked = getMetricsStatus();  
  const saveMetrics = refs.saveMetrics;
  saveMetrics.addEventListener('click', (e) => {
    if (refs.sendMetricsCheckbox.checked) {
      enableMetrics();
    } else {
      disableMetrics();
    }
  });

  return {
    refs,
    node,
  };
}
