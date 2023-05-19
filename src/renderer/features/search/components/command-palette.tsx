/* eslint-disable react/no-unknown-property */
import { useCallback, useState } from 'react';
import { Group, Kbd, ScrollArea } from '@mantine/core';
import { useDisclosure, useDebouncedValue } from '@mantine/hooks';
import { generatePath, useNavigate } from 'react-router';
import styled from 'styled-components';
import { GoToCommands } from './go-to-commands';
import { Command, CommandPalettePages } from '/@/renderer/features/search/components/command';
import { Modal, Paper, Spinner } from '/@/renderer/components';
import { HomeCommands } from './home-commands';
import { ServerCommands } from '/@/renderer/features/search/components/server-commands';
import { useSearch } from '/@/renderer/features/search/queries/search-query';
import { useCurrentServer } from '/@/renderer/store';
import { AppRoute } from '/@/renderer/router/routes';
import { LibraryCommandItem } from '/@/renderer/features/search/components/library-command-item';
import { LibraryItem } from '/@/renderer/api/types';
import { usePlayQueueAdd } from '/@/renderer/features/player';

interface CommandPaletteProps {
  modalProps: typeof useDisclosure['arguments'];
}

const CustomModal = styled(Modal)`
  & .mantine-Modal-header {
    display: none;
  }
`;

export const CommandPalette = ({ modalProps }: CommandPaletteProps) => {
  const navigate = useNavigate();
  const server = useCurrentServer();
  const [value, setValue] = useState('');
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 400);
  const [pages, setPages] = useState<CommandPalettePages[]>([CommandPalettePages.HOME]);
  const activePage = pages[pages.length - 1];
  const isHome = activePage === CommandPalettePages.HOME;

  const popPage = useCallback(() => {
    setPages((pages) => {
      const x = [...pages];
      x.splice(-1, 1);
      return x;
    });
  }, []);

  const { data, isLoading } = useSearch({
    options: { enabled: debouncedQuery !== '' && query !== '' },
    query: {
      albumArtistLimit: 4,
      albumArtistStartIndex: 0,
      albumLimit: 4,
      albumStartIndex: 0,
      query: debouncedQuery,
      songLimit: 4,
      songStartIndex: 0,
    },
    serverId: server?.id,
  });

  const showAlbumGroup = Boolean(query && data && data?.albums?.length > 0);
  const showArtistGroup = Boolean(query && data && data?.albumArtists?.length > 0);
  const showTrackGroup = Boolean(query && data && data?.songs?.length > 0);

  const handlePlayQueueAdd = usePlayQueueAdd();

  return (
    <CustomModal
      {...modalProps}
      centered
      handlers={{
        ...modalProps.handlers,
        close: () => {
          if (isHome) {
            modalProps.handlers.close();
            setQuery('');
          } else {
            popPage();
          }
        },
        toggle: () => {
          if (isHome) {
            modalProps.handlers.toggle();
            setQuery('');
          } else {
            popPage();
          }
        },
      }}
      scrollAreaComponent={ScrollArea.Autosize}
      size="lg"
    >
      <Command
        filter={(value, search) => {
          if (value.includes(search)) return 1;
          if (value.includes('search')) return 1;
          return 0;
        }}
        label="Global Command Menu"
        value={value}
        onValueChange={setValue}
      >
        <Command.Input
          autoFocus
          placeholder="Enter search..."
          value={query}
          onValueChange={setQuery}
        />
        <Command.Separator />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          {showAlbumGroup && (
            <Command.Group heading="Albums">
              {data?.albums?.map((album) => (
                <Command.Item
                  key={`search-album-${album.id}`}
                  value={`search-${album.id}`}
                  onSelect={() =>
                    navigate(generatePath(AppRoute.LIBRARY_ALBUMS_DETAIL, { albumId: album.id }))
                  }
                >
                  <LibraryCommandItem
                    handlePlayQueueAdd={handlePlayQueueAdd}
                    id={album.id}
                    imageUrl={album.imageUrl}
                    itemType={LibraryItem.ALBUM}
                    subtitle={album.albumArtists.map((artist) => artist.name).join(', ')}
                    title={album.name}
                  />
                </Command.Item>
              ))}
            </Command.Group>
          )}
          {showArtistGroup && (
            <Command.Group heading="Artists">
              {data?.albumArtists.map((artist) => (
                <Command.Item
                  key={`artist-${artist.id}`}
                  value={`search-${artist.id}`}
                  onSelect={() =>
                    navigate(
                      generatePath(AppRoute.LIBRARY_ALBUM_ARTISTS_DETAIL, {
                        albumArtistId: artist.id,
                      }),
                    )
                  }
                >
                  <LibraryCommandItem
                    handlePlayQueueAdd={handlePlayQueueAdd}
                    id={artist.id}
                    imageUrl={artist.imageUrl}
                    itemType={LibraryItem.ALBUM_ARTIST}
                    subtitle={
                      (artist?.albumCount || 0) > 0 ? `${artist.albumCount} albums` : undefined
                    }
                    title={artist.name}
                  />
                </Command.Item>
              ))}
            </Command.Group>
          )}
          {showTrackGroup && (
            <Command.Group heading="Tracks">
              {data?.songs.map((song) => (
                <Command.Item
                  key={`artist-${song.id}`}
                  value={`search-${song.id}`}
                  onSelect={() =>
                    navigate(
                      generatePath(AppRoute.LIBRARY_ALBUMS_DETAIL, {
                        albumId: song.albumId,
                      }),
                    )
                  }
                >
                  <LibraryCommandItem
                    handlePlayQueueAdd={handlePlayQueueAdd}
                    id={song.id}
                    imageUrl={song.imageUrl}
                    itemType={LibraryItem.SONG}
                    subtitle={song.artists.map((artist) => artist.name).join(', ')}
                    title={song.name}
                  />
                </Command.Item>
              ))}
            </Command.Group>
          )}
          {activePage === CommandPalettePages.HOME && (
            <HomeCommands
              handleClose={modalProps.handlers.close}
              pages={pages}
              query={query}
              setPages={setPages}
              setQuery={setQuery}
            />
          )}
          {activePage === CommandPalettePages.GO_TO && (
            <GoToCommands
              handleClose={modalProps.handlers.close}
              setPages={setPages}
              setQuery={setQuery}
            />
          )}
          {activePage === CommandPalettePages.MANAGE_SERVERS && (
            <ServerCommands
              handleClose={modalProps.handlers.close}
              setPages={setPages}
              setQuery={setQuery}
            />
          )}
        </Command.List>
      </Command>
      <Paper
        mt="0.5rem"
        p="0.5rem"
      >
        <Group position="apart">
          <Command.Loading>{isLoading && query !== '' && <Spinner />}</Command.Loading>
          <Group spacing="sm">
            <Kbd size="md">ESC</Kbd>
            <Kbd size="md">↑</Kbd>
            <Kbd size="md">↓</Kbd>
            <Kbd size="md">⏎</Kbd>
          </Group>
        </Group>
      </Paper>
    </CustomModal>
  );
};
